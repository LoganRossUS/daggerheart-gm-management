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

  // === CHARACTERS ROUTES ===

  // GET /api/campaigns/:id/characters - List characters
  const listCharsMatch = path.match(/^\/api\/campaigns\/([^/]+)\/characters$/);
  if (listCharsMatch && method === 'GET') {
    return listCharacters(userId, listCharsMatch[1], env, { jsonResponse, errorResponse });
  }

  // POST /api/campaigns/:id/characters - Create character
  const createCharMatch = path.match(/^\/api\/campaigns\/([^/]+)\/characters$/);
  if (createCharMatch && method === 'POST') {
    const body = await request.json();
    return createCharacter(userId, createCharMatch[1], body, env, { jsonResponse, errorResponse });
  }

  // GET /api/campaigns/:campaignId/characters/:characterId - Get character
  const getCharMatch = path.match(/^\/api\/campaigns\/([^/]+)\/characters\/([^/]+)$/);
  if (getCharMatch && method === 'GET') {
    return getCharacter(userId, getCharMatch[1], getCharMatch[2], env, { jsonResponse, errorResponse });
  }

  // PUT /api/campaigns/:campaignId/characters/:characterId - Update character
  const updateCharMatch = path.match(/^\/api\/campaigns\/([^/]+)\/characters\/([^/]+)$/);
  if (updateCharMatch && method === 'PUT') {
    const body = await request.json();
    return updateCharacter(userId, updateCharMatch[1], updateCharMatch[2], body, env, { jsonResponse, errorResponse });
  }

  // DELETE /api/campaigns/:campaignId/characters/:characterId - Delete character
  const deleteCharMatch = path.match(/^\/api\/campaigns\/([^/]+)\/characters\/([^/]+)$/);
  if (deleteCharMatch && method === 'DELETE') {
    return deleteCharacter(userId, deleteCharMatch[1], deleteCharMatch[2], env, { jsonResponse, errorResponse });
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

    // Also fetch notes and characters for this campaign
    const [notes, characters] = await Promise.all([
      listFirestoreDocs(`users/${userId}/campaigns/${campaignId}/notes`, env),
      listFirestoreDocs(`users/${userId}/campaigns/${campaignId}/characters`, env)
    ]);

    return jsonResponse({ ...campaign, notes, characters });
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

    // Check if battleMap contains base64 data (too large for Firestore)
    if (data.encounter?.battleMap?.map?.mapImage?.startsWith('data:')) {
      return errorResponse('Scene contains base64 image data which is too large. Please upload images to cloud storage.', 400);
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Don't allow overwriting metadata
    updated.createdAt = existing.createdAt;

    // Check approximate document size (rough estimate)
    const jsonSize = JSON.stringify(updated).length;
    if (jsonSize > 900000) { // ~900KB, leaving buffer for Firestore overhead
      return errorResponse('Scene data too large. Please use cloud storage for images.', 400);
    }

    await setFirestoreDoc(`users/${userId}/campaigns/${campaignId}/scenes/${sceneId}`, updated, env);

    return jsonResponse(updated);
  } catch (err) {
    console.error('Update scene error:', err);
    return errorResponse(`Failed to update scene: ${err.message}`, 500);
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

// === CHARACTER FUNCTIONS ===

async function listCharacters(userId, campaignId, env, { jsonResponse, errorResponse }) {
  try {
    // Verify campaign exists
    const campaign = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, env);
    if (!campaign) {
      return errorResponse('Campaign not found', 404);
    }

    const characters = await listFirestoreDocs(`users/${userId}/campaigns/${campaignId}/characters`, env);
    return jsonResponse({ characters });
  } catch (err) {
    console.error('List characters error:', err);
    return errorResponse('Failed to list characters', 500);
  }
}

async function createCharacter(userId, campaignId, data, env, { jsonResponse, errorResponse }) {
  try {
    // Verify campaign exists
    const campaign = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}`, env);
    if (!campaign) {
      return errorResponse('Campaign not found', 404);
    }

    const characterId = data.id || crypto.randomUUID();
    const now = new Date().toISOString();

    const character = {
      name: data.name || 'New Character',
      level: data.level || 1,
      ancestry: data.ancestry || '',
      characterClass: data.characterClass || '',
      subclass: data.subclass || '',
      currentHp: data.currentHp || 0,
      maxHp: data.maxHp || 0,
      currentStress: data.currentStress || 0,
      maxStress: data.maxStress || 0,
      armor: data.armor || 0,
      evasion: data.evasion || 10,
      minorThreshold: data.minorThreshold || 0,
      majorThreshold: data.majorThreshold || 0,
      severeThreshold: data.severeThreshold || 0,
      domains: data.domains || [],
      experiences: data.experiences || [],
      abilities: data.abilities || [],
      feats: data.feats || [],
      notes: data.notes || '',
      portrait: data.portrait || null,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    await setFirestoreDoc(`users/${userId}/campaigns/${campaignId}/characters/${characterId}`, character, env);

    return jsonResponse({ characterId, ...character });
  } catch (err) {
    console.error('Create character error:', err);
    return errorResponse('Failed to create character', 500);
  }
}

async function getCharacter(userId, campaignId, characterId, env, { jsonResponse, errorResponse }) {
  try {
    const character = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}/characters/${characterId}`, env);

    if (!character) {
      return errorResponse('Character not found', 404);
    }

    return jsonResponse(character);
  } catch (err) {
    console.error('Get character error:', err);
    return errorResponse('Failed to get character', 500);
  }
}

async function updateCharacter(userId, campaignId, characterId, data, env, { jsonResponse, errorResponse }) {
  try {
    const existing = await getFirestoreDoc(`users/${userId}/campaigns/${campaignId}/characters/${characterId}`, env);

    if (!existing) {
      return errorResponse('Character not found', 404);
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Don't allow overwriting metadata
    updated.createdAt = existing.createdAt;

    await setFirestoreDoc(`users/${userId}/campaigns/${campaignId}/characters/${characterId}`, updated, env);

    return jsonResponse(updated);
  } catch (err) {
    console.error('Update character error:', err);
    return errorResponse('Failed to update character', 500);
  }
}

async function deleteCharacter(userId, campaignId, characterId, env, { jsonResponse, errorResponse }) {
  try {
    await deleteFirestoreDoc(`users/${userId}/campaigns/${campaignId}/characters/${characterId}`, env);
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Delete character error:', err);
    return errorResponse('Failed to delete character', 500);
  }
}
