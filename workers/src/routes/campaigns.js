import {
  verifyIdToken,
  getFirestoreDoc,
  setFirestoreDoc,
  deleteFirestoreDoc,
  listFirestoreDocs
} from '../lib/firebase.js';

export async function handleCampaigns(request, env, { jsonResponse, errorResponse }) {
  // Verify auth for all campaign routes
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
    return errorResponse('Upgrade required for cloud save', 403);
  }

  // Route handling
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // GET /api/campaigns - List campaigns
  if (path === '/api/campaigns' && method === 'GET') {
    return listCampaigns(userId, env, { jsonResponse, errorResponse });
  }

  // POST /api/campaigns - Create campaign
  if (path === '/api/campaigns' && method === 'POST') {
    const body = await request.json();
    return createCampaign(userId, body, env, { jsonResponse, errorResponse });
  }

  // GET /api/campaigns/:id - Get campaign
  const getMatch = path.match(/^\/api\/campaigns\/([^/]+)$/);
  if (getMatch && method === 'GET') {
    return getCampaign(userId, getMatch[1], env, { jsonResponse, errorResponse });
  }

  // PUT /api/campaigns/:id - Update campaign
  const putMatch = path.match(/^\/api\/campaigns\/([^/]+)$/);
  if (putMatch && method === 'PUT') {
    const body = await request.json();
    return updateCampaign(userId, putMatch[1], body, env, { jsonResponse, errorResponse });
  }

  // DELETE /api/campaigns/:id - Delete campaign
  const deleteMatch = path.match(/^\/api\/campaigns\/([^/]+)$/);
  if (deleteMatch && method === 'DELETE') {
    return deleteCampaign(userId, deleteMatch[1], env, { jsonResponse, errorResponse });
  }

  // === SCENES ROUTES ===

  // GET /api/campaigns/:id/scenes - List scenes
  const listScenesMatch = path.match(/^\/api\/campaigns\/([^/]+)\/scenes$/);
  if (listScenesMatch && method === 'GET') {
    return listScenes(userId, listScenesMatch[1], env, { jsonResponse, errorResponse });
  }

  // POST /api/campaigns/:id/scenes - Create scene
  const createSceneMatch = path.match(/^\/api\/campaigns\/([^/]+)\/scenes$/);
  if (createSceneMatch && method === 'POST') {
    const body = await request.json();
    return createScene(userId, createSceneMatch[1], body, env, { jsonResponse, errorResponse });
  }

  // GET /api/campaigns/:campaignId/scenes/:sceneId - Get scene
  const getSceneMatch = path.match(/^\/api\/campaigns\/([^/]+)\/scenes\/([^/]+)$/);
  if (getSceneMatch && method === 'GET') {
    return getScene(userId, getSceneMatch[1], getSceneMatch[2], env, { jsonResponse, errorResponse });
  }

  // PUT /api/campaigns/:campaignId/scenes/:sceneId - Update scene
  const updateSceneMatch = path.match(/^\/api\/campaigns\/([^/]+)\/scenes\/([^/]+)$/);
  if (updateSceneMatch && method === 'PUT') {
    const body = await request.json();
    return updateScene(userId, updateSceneMatch[1], updateSceneMatch[2], body, env, { jsonResponse, errorResponse });
  }

  // DELETE /api/campaigns/:campaignId/scenes/:sceneId - Delete scene
  const deleteSceneMatch = path.match(/^\/api\/campaigns\/([^/]+)\/scenes\/([^/]+)$/);
  if (deleteSceneMatch && method === 'DELETE') {
    return deleteScene(userId, deleteSceneMatch[1], deleteSceneMatch[2], env, { jsonResponse, errorResponse });
  }

  return errorResponse('Not Found', 404);
}

async function listCampaigns(userId, env, { jsonResponse, errorResponse }) {
  try {
    const campaigns = await listFirestoreDocs(`users/${userId}/campaigns`, env);
    return jsonResponse({ campaigns });
  } catch (err) {
    console.error('List campaigns error:', err);
    return errorResponse('Failed to list campaigns', 500);
  }
}

async function createCampaign(userId, data, env, { jsonResponse, errorResponse }) {
  try {
    const campaignId = crypto.randomUUID();
    const now = new Date().toISOString();

    const campaign = {
      name: data.name || 'Untitled Campaign',
      createdAt: now,
      updatedAt: now,
      encounter: data.encounter || null,
    };

    await setFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, campaign, env);

    return jsonResponse({ campaignId, ...campaign });
  } catch (err) {
    console.error('Create campaign error:', err);
    return errorResponse('Failed to create campaign', 500);
  }
}

async function getCampaign(userId, campaignId, env, { jsonResponse, errorResponse }) {
  try {
    const campaign = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, env);

    if (!campaign) {
      return errorResponse('Campaign not found', 404);
    }

    // Also fetch notes for this campaign
    const notes = await listFirestoreDocs(
      `users/${userId}/campaigns/${campaignId}/notes`,
      env
    );

    return jsonResponse({ ...campaign, notes });
  } catch (err) {
    console.error('Get campaign error:', err);
    return errorResponse('Failed to get campaign', 500);
  }
}

async function updateCampaign(userId, campaignId, data, env, { jsonResponse, errorResponse }) {
  try {
    // Verify campaign exists and belongs to user
    const existing = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, env);

    if (!existing) {
      return errorResponse('Campaign not found', 404);
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Don't allow overwriting metadata
    updated.createdAt = existing.createdAt;

    await setFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, updated, env);

    return jsonResponse(updated);
  } catch (err) {
    console.error('Update campaign error:', err);
    return errorResponse('Failed to update campaign', 500);
  }
}

async function deleteCampaign(userId, campaignId, env, { jsonResponse, errorResponse }) {
  try {
    await deleteFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, env);
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Delete campaign error:', err);
    return errorResponse('Failed to delete campaign', 500);
  }
}

// === SCENE FUNCTIONS ===

async function listScenes(userId, campaignId, env, { jsonResponse, errorResponse }) {
  try {
    // Verify campaign exists
    const campaign = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, env);
    if (!campaign) {
      return errorResponse('Campaign not found', 404);
    }

    const scenes = await listFirestoreDocs(`users/${userId}/campaigns/${campaignId}/scenes`, env);
    return jsonResponse({ scenes });
  } catch (err) {
    console.error('List scenes error:', err);
    return errorResponse('Failed to list scenes', 500);
  }
}

async function createScene(userId, campaignId, data, env, { jsonResponse, errorResponse }) {
  try {
    // Verify campaign exists
    const campaign = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, env);
    if (!campaign) {
      return errorResponse('Campaign not found', 404);
    }

    const sceneId = crypto.randomUUID();
    const now = new Date().toISOString();

    const scene = {
      name: data.name || 'Untitled Scene',
      createdAt: now,
      updatedAt: now,
      encounter: data.encounter || null,
    };

    await setFirestoreDoc(`users/${userId}/campaigns/${campaignId}/scenes/${sceneId}`, scene, env);

    return jsonResponse({ sceneId, ...scene });
  } catch (err) {
    console.error('Create scene error:', err);
    return errorResponse('Failed to create scene', 500);
  }
}

async function getScene(userId, campaignId, sceneId, env, { jsonResponse, errorResponse }) {
  try {
    const scene = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}/scenes/${sceneId}`, env);

    if (!scene) {
      return errorResponse('Scene not found', 404);
    }

    return jsonResponse(scene);
  } catch (err) {
    console.error('Get scene error:', err);
    return errorResponse('Failed to get scene', 500);
  }
}

async function updateScene(userId, campaignId, sceneId, data, env, { jsonResponse, errorResponse }) {
  try {
    const existing = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}/scenes/${sceneId}`, env);

    if (!existing) {
      return errorResponse('Scene not found', 404);
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Don't allow overwriting metadata
    updated.createdAt = existing.createdAt;

    await setFirestoreDoc(`users/${userId}/campaigns/${campaignId}/scenes/${sceneId}`, updated, env);

    return jsonResponse(updated);
  } catch (err) {
    console.error('Update scene error:', err);
    return errorResponse('Failed to update scene', 500);
  }
}

async function deleteScene(userId, campaignId, sceneId, env, { jsonResponse, errorResponse }) {
  try {
    await deleteFirestoreDoc(`users/${userId}/campaigns/${campaignId}/scenes/${sceneId}`, env);
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Delete scene error:', err);
    return errorResponse('Failed to delete scene', 500);
  }
}
