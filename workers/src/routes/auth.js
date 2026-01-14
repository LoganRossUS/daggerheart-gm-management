import { verifyIdToken, getFirestoreDoc, setFirestoreDoc } from '../lib/firebase.js';

export async function handleAuth(request, env, { jsonResponse, errorResponse }) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/auth/verify' && request.method === 'POST') {
    return verifyAndGetProfile(request, env, { jsonResponse, errorResponse });
  }

  return errorResponse('Not Found', 404);
}

async function verifyAndGetProfile(request, env, { jsonResponse, errorResponse }) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse('Missing authorization header', 401);
  }

  const token = authHeader.substring(7);

  try {
    const firebaseUser = await verifyIdToken(token, env);
    const userId = firebaseUser.localId;

    // Get or create user profile
    let profile = await getFirestoreDoc(`users/${userId}/profile`, env);
    let entitlement = await getFirestoreDoc(`users/${userId}/entitlement`, env);

    if (!profile) {
      // First time user - create profile
      profile = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      await setFirestoreDoc(`users/${userId}/profile`, profile, env);

      // Initialize usage tracking
      await setFirestoreDoc(`users/${userId}/usage`, {
        storageBytes: 0,
        lastUpdated: new Date().toISOString(),
      }, env);
    }

    return jsonResponse({
      userId,
      profile,
      entitlement: entitlement || { tier: 'demo' },
    });
  } catch (err) {
    console.error('Auth error:', err);
    return errorResponse('Authentication failed', 401);
  }
}
