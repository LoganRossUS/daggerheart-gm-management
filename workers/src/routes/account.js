import {
  verifyIdToken,
  getFirestoreDoc,
  deleteFirestoreDoc,
  listFirestoreDocs,
} from '../lib/firebase.js';

export async function handleAccount(request, env, { jsonResponse, errorResponse }) {
  // Verify auth for all account routes
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

  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // DELETE /api/account - Delete user account and all data
  if (path === '/api/account' && method === 'DELETE') {
    return deleteAccount(userId, env, { jsonResponse, errorResponse });
  }

  return errorResponse('Not Found', 404);
}

async function deleteAccount(userId, env, { jsonResponse, errorResponse }) {
  try {
    // Delete all campaigns and their subcollections
    const campaigns = await listFirestoreDocs(`users/${userId}/campaigns`, env);

    for (const campaign of campaigns) {
      // Delete scenes in campaign
      const scenes = await listFirestoreDocs(`users/${userId}/campaigns/${campaign.id}/scenes`, env);
      for (const scene of scenes) {
        await deleteFirestoreDoc(`users/${userId}/campaigns/${campaign.id}/scenes/${scene.id}`, env);
      }

      // Delete characters in campaign
      const characters = await listFirestoreDocs(`users/${userId}/campaigns/${campaign.id}/characters`, env);
      for (const character of characters) {
        await deleteFirestoreDoc(`users/${userId}/campaigns/${campaign.id}/characters/${character.id}`, env);
      }

      // Delete notes in campaign
      const notes = await listFirestoreDocs(`users/${userId}/campaigns/${campaign.id}/notes`, env);
      for (const note of notes) {
        await deleteFirestoreDoc(`users/${userId}/campaigns/${campaign.id}/notes/${note.id}`, env);
      }

      // Delete the campaign itself
      await deleteFirestoreDoc(`users/${userId}/campaigns/${campaign.id}`, env);
    }

    // Delete all user files from R2
    try {
      const r2 = env.R2_BUCKET;
      if (r2) {
        const objects = await r2.list({ prefix: `users/${userId}/` });
        for (const obj of objects.objects) {
          await r2.delete(obj.key);
        }
      }
    } catch (r2Err) {
      console.error('Failed to delete R2 files:', r2Err);
      // Continue even if R2 deletion fails
    }

    // Delete the user document itself
    await deleteFirestoreDoc(`users/${userId}`, env);

    return jsonResponse({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    return errorResponse('Failed to delete account', 500);
  }
}
