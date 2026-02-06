import { verifyIdToken, getFirestoreDoc, setFirestoreDoc, deleteFirestoreDoc } from '../lib/firebase.js';

export async function handleSettings(request, env, { jsonResponse, errorResponse }) {
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

  // Check entitlement - premium only
  const userDoc = await getFirestoreDoc(`users/${userId}`, env);
  const entitlement = userDoc?.entitlement;

  if (!entitlement || entitlement.tier !== 'premium') {
    return errorResponse('Premium subscription required for this feature', 403);
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // PUT /api/settings/api-key - Save OpenAI API key
  if (path === '/api/settings/api-key' && method === 'PUT') {
    try {
      const body = await request.json();
      const { apiKey } = body;

      if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
        return errorResponse('API key is required', 400);
      }

      // Basic validation - OpenAI keys start with sk-
      const trimmedKey = apiKey.trim();
      if (!trimmedKey.startsWith('sk-')) {
        return errorResponse('Invalid OpenAI API key format. Keys should start with sk-', 400);
      }

      await setFirestoreDoc(`users/${userId}/settings/openai`, {
        apiKey: trimmedKey,
        updatedAt: new Date().toISOString(),
      }, env);

      return jsonResponse({ success: true });
    } catch (err) {
      console.error('Save API key error:', err);
      return errorResponse('Failed to save API key', 500);
    }
  }

  // GET /api/settings/api-key/status - Check if API key exists
  if (path === '/api/settings/api-key/status' && method === 'GET') {
    try {
      const settingsDoc = await getFirestoreDoc(`users/${userId}/settings/openai`, env);
      const hasKey = !!(settingsDoc?.apiKey);
      return jsonResponse({ hasKey });
    } catch (err) {
      console.error('Check API key status error:', err);
      return jsonResponse({ hasKey: false });
    }
  }

  // DELETE /api/settings/api-key - Remove API key
  if (path === '/api/settings/api-key' && method === 'DELETE') {
    try {
      await deleteFirestoreDoc(`users/${userId}/settings/openai`, env);
      return jsonResponse({ success: true });
    } catch (err) {
      console.error('Delete API key error:', err);
      return errorResponse('Failed to remove API key', 500);
    }
  }

  return errorResponse('Not Found', 404);
}
