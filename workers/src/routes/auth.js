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

    // Extract email and display name with fallbacks
    const email = firebaseUser.email || '';
    const displayName = firebaseUser.displayName ||
      (email ? email.split('@')[0] : `User_${userId.slice(0, 8)}`);

    // Get or create user document
    let userDoc = await getFirestoreDoc(`users/${userId}`, env);

    // Check if document doesn't exist or is missing the profile field (migration case)
    if (!userDoc || !userDoc.profile) {
      // Create or update user document with all fields
      userDoc = {
        profile: {
          email,
          displayName,
          createdAt: new Date().toISOString(),
        },
        usage: {
          storageBytes: 0,
          lastUpdated: new Date().toISOString(),
        },
        entitlement: {
          tier: 'demo',
        },
      };
      await setFirestoreDoc(`users/${userId}`, userDoc, env);
    }

    return jsonResponse({
      userId,
      profile: userDoc.profile,
      entitlement: userDoc.entitlement || { tier: 'demo' },
    });
  } catch (err) {
    console.error('Auth error:', err);
    return errorResponse('Authentication failed', 401);
  }
}
