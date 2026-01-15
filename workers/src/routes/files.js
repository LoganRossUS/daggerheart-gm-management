import { verifyIdToken, getFirestoreDoc, setFirestoreDoc, deleteFirestoreDoc, listFirestoreDocs } from '../lib/firebase.js';

const R2_PUBLIC_URL = 'https://pub-fcd553bb197a4935b7e97601f28e1bc0.r2.dev';

export async function handleFiles(request, env, { jsonResponse, errorResponse }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle file deletion: DELETE /api/files/:fileId
  const deleteMatch = path.match(/^\/api\/files\/([^/]+)$/);
  if (deleteMatch && request.method === 'DELETE') {
    return handleFileDelete(request, env, deleteMatch[1], { jsonResponse, errorResponse });
  }

  // Handle list files: GET /api/files
  if (request.method !== 'GET') {
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

  // Check entitlement
  const userDoc = await getFirestoreDoc(`users/${userId}`, env);
  const entitlement = userDoc?.entitlement;

  if (!entitlement || !['basic', 'premium'].includes(entitlement.tier)) {
    return errorResponse('Upgrade required to view files', 403);
  }

  try {
    // List all files for this user from Firestore
    const files = await listFirestoreDocs(`users/${userId}/files`, env);

    // Filter to only uploaded files (completed uploads) and image types
    const imageFiles = files
      .filter(file => file.uploaded && file.contentType?.startsWith('image/'))
      .map(file => ({
        id: file.id,
        filename: file.filename,
        size: file.size,
        contentType: file.contentType,
        url: `${R2_PUBLIC_URL}/${file.key}`,
        createdAt: file.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return jsonResponse({ files: imageFiles });
  } catch (err) {
    console.error('List files error:', err);
    return errorResponse('Failed to list files', 500);
  }
}

async function handleFileDelete(request, env, fileId, { jsonResponse, errorResponse }) {
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

  // Get file metadata to verify ownership
  const fileDoc = await getFirestoreDoc(`users/${userId}/files/${fileId}`, env);

  if (!fileDoc) {
    return errorResponse('File not found', 404);
  }

  try {
    // Delete from R2
    await env.STORAGE.delete(fileDoc.key);

    // Delete metadata from Firestore
    await deleteFirestoreDoc(`users/${userId}/files/${fileId}`, env);

    // Update storage usage
    const userDoc = await getFirestoreDoc(`users/${userId}`, env);
    const usage = userDoc?.usage || { storageBytes: 0 };
    const newStorageBytes = Math.max(0, usage.storageBytes - (fileDoc.size || 0));

    await setFirestoreDoc(`users/${userId}`, {
      ...userDoc,
      usage: {
        storageBytes: newStorageBytes,
        lastUpdated: new Date().toISOString(),
      },
    }, env);

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('File delete error:', err);
    return errorResponse('Failed to delete file', 500);
  }
}
