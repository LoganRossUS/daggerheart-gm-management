import { verifyIdToken, getFirestoreDoc, setFirestoreDoc } from '../lib/firebase.js';

const STORAGE_LIMIT_BYTES = 250 * 1024 * 1024; // 250MB for basic tier
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

export async function handleUpload(request, env, { jsonResponse, errorResponse }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle file data upload: PUT /api/upload/:fileId/data
  const dataMatch = path.match(/^\/api\/upload\/([^/]+)\/data$/);
  if (dataMatch && request.method === 'PUT') {
    return handleFileDataUpload(request, env, dataMatch[1], { jsonResponse, errorResponse });
  }

  // Handle upload request: POST /api/upload
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // Verify auth
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse('Missing authorization header', 401);
  }

  const token = authHeader.substring(7);
  let userId;

  try {
    const firebaseUser = await verifyIdToken(token, env);
    userId = firebaseUser.localId;
  } catch (err) {
    return errorResponse('Authentication failed', 401);
  }

  // Check entitlement (stored as field on user document)
  const userDoc = await getFirestoreDoc(`users/${userId}`, env);
  const entitlement = userDoc?.entitlement;

  if (!entitlement || !['basic', 'premium'].includes(entitlement.tier)) {
    return errorResponse('Upgrade required for file uploads', 403);
  }

  // Check storage usage (stored as field on user document)
  const usage = userDoc?.usage || { storageBytes: 0 };
  const body = await request.json();
  const { filename, size, contentType } = body;

  if (!filename || !size) {
    return errorResponse('Missing filename or size', 400);
  }

  if (size > MAX_FILE_SIZE) {
    return errorResponse(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400);
  }

  if (usage.storageBytes + size > STORAGE_LIMIT_BYTES) {
    return errorResponse('Storage limit exceeded. Delete some files or upgrade your plan.', 403);
  }

  // Generate presigned URL for R2 upload
  const fileId = crypto.randomUUID();
  const key = `user-uploads/${userId}/${fileId}`;

  try {
    // For R2, we return a direct upload URL
    // The client will PUT the file to this URL
    const expiresIn = 300; // 5 minutes

    // Update usage (optimistically - will be reconciled if upload fails)
    await setFirestoreDoc(`users/${userId}`, {
      ...userDoc,
      usage: {
        storageBytes: usage.storageBytes + size,
        lastUpdated: new Date().toISOString(),
      },
    }, env);

    // Store file metadata for later retrieval
    await setFirestoreDoc(`users/${userId}/files/${fileId}`, {
      filename,
      size,
      contentType,
      key,
      createdAt: new Date().toISOString(),
    }, env);

    // Return upload instructions
    // Client should use PUT with the returned URL
    return jsonResponse({
      fileId,
      key,
      expiresIn,
      uploadMethod: 'PUT',
      // The actual upload will go through a separate endpoint
      uploadUrl: `/upload/${fileId}/data`,
    });
  } catch (err) {
    console.error('Upload URL generation error:', err);
    return errorResponse('Failed to generate upload URL', 500);
  }
}

async function handleFileDataUpload(request, env, fileId, { jsonResponse, errorResponse }) {
  // Verify auth
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse('Missing authorization header', 401);
  }

  const token = authHeader.substring(7);
  let userId;

  try {
    const firebaseUser = await verifyIdToken(token, env);
    userId = firebaseUser.localId;
  } catch (err) {
    return errorResponse('Authentication failed', 401);
  }

  // Get file metadata to verify ownership and get the key
  const fileDoc = await getFirestoreDoc(`users/${userId}/files/${fileId}`, env);

  if (!fileDoc) {
    return errorResponse('File not found or upload expired', 404);
  }

  // Check if already uploaded
  if (fileDoc.uploaded) {
    return errorResponse('File already uploaded', 400);
  }

  try {
    // Get the file data from the request body
    const fileData = await request.arrayBuffer();

    // Verify file size matches what was declared
    if (fileData.byteLength > MAX_FILE_SIZE) {
      return errorResponse(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400);
    }

    // Upload to R2
    await env.STORAGE.put(fileDoc.key, fileData, {
      httpMetadata: {
        contentType: fileDoc.contentType || 'application/octet-stream',
      },
    });

    // Mark file as uploaded
    await setFirestoreDoc(`users/${userId}/files/${fileId}`, {
      ...fileDoc,
      uploaded: true,
      uploadedAt: new Date().toISOString(),
    }, env);

    // Return the public URL for the file
    // Using the R2 public bucket URL pattern
    const publicUrl = `https://pub-daggerheart.r2.dev/${fileDoc.key}`;

    return jsonResponse({
      success: true,
      fileId,
      url: publicUrl,
    });
  } catch (err) {
    console.error('File upload error:', err);
    return errorResponse('Failed to upload file', 500);
  }
}
