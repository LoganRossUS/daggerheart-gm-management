import { verifyIdToken, getFirestoreDoc, setFirestoreDoc, deleteFirestoreDoc, listFirestoreDocs } from '../lib/firebase.js';

const STYLE_PREFIX = 'Digital concept art style, hand-painted texture, vibrant fantasy colors, dramatic rim lighting, isolated on a clean white background, high-detail character design, TTRPG rulebook illustation.';

// Map Daggerheart ancestries to visual descriptions DALL-E can understand
const ANCESTRY_VISUAL_MAP = {
  clank: 'mechanical construct humanoid with metallic plating and glowing eyes',
  drakona: 'dragonborn humanoid with scaled skin and reptilian features',
  dwarf: 'stout dwarf with a broad build',
  elf: 'graceful elf with pointed ears and angular features',
  faerie: 'tiny fey creature with delicate insect-like wings',
  faun: 'satyr-like humanoid with goat legs and small horns',
  firbolg: 'tall gentle giant with earthy features and a broad nose',
  fungril: 'mushroom-like humanoid with fungal growths and spore patches',
  galapa: 'tortoise-like humanoid with a shell and weathered skin',
  giant: 'towering humanoid of immense stature',
  goblin: 'small green-skinned goblin with large pointed ears',
  halfling: 'small cheerful halfling with curly hair and bare feet',
  human: 'human',
  infernis: 'tiefling-like humanoid with horns and infernal features',
  katari: 'feline humanoid with cat-like ears and fur',
  orc: 'muscular orc with tusks and green-tinted skin',
  ribbet: 'frog-like humanoid with amphibian features and wide eyes',
  simiah: 'ape-like humanoid with primate features and long arms',
};

function buildPrompt(npcData) {
  const ancestry = ANCESTRY_VISUAL_MAP[npcData.ancestryKey] || npcData.ancestry || 'fantasy humanoid';
  const sex = npcData.sex || '';
  const ageCategory = npcData.ageCategory || 'adult';
  const occupation = npcData.occupation?.name || npcData.occupation || '';
  const description = npcData.description || '';
  const clothing = npcData.clothing || '';

  const prompt = `${STYLE_PREFIX} Portrait of a ${ageCategory} ${sex.toLowerCase()} ${ancestry} ${occupation.toLowerCase()}. ${description} ${clothing}`;

  // DALL-E has a 4000 char prompt limit, truncate if needed
  return prompt.substring(0, 3900);
}

export async function handleNpcPortraits(request, env, { jsonResponse, errorResponse }) {
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
    return errorResponse('Premium subscription required for NPC image generation', 403);
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // POST /api/npc-portraits/generate - Generate a portrait via DALL-E
  if (path === '/api/npc-portraits/generate' && method === 'POST') {
    return generatePortrait(request, env, userId, userDoc, { jsonResponse, errorResponse });
  }

  // GET /api/npc-portraits - List saved portraits
  if (path === '/api/npc-portraits' && method === 'GET') {
    return listPortraits(env, userId, { jsonResponse, errorResponse });
  }

  // DELETE /api/npc-portraits/:id
  const deleteMatch = path.match(/^\/api\/npc-portraits\/([^/]+)$/);
  if (deleteMatch && method === 'DELETE') {
    return deletePortrait(env, userId, deleteMatch[1], userDoc, { jsonResponse, errorResponse });
  }

  return errorResponse('Not Found', 404);
}

async function generatePortrait(request, env, userId, userDoc, { jsonResponse, errorResponse }) {
  try {
    const npcData = await request.json();

    if (!npcData || !npcData.name) {
      return errorResponse('NPC data is required', 400);
    }

    // Retrieve user's OpenAI API key from Firestore
    const settingsDoc = await getFirestoreDoc(`users/${userId}/settings/openai`, env);
    if (!settingsDoc?.apiKey) {
      return errorResponse('OpenAI API key not configured. Please add your API key in Settings.', 400);
    }

    const prompt = buildPrompt(npcData);

    // Call DALL-E API
    const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settingsDoc.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json',
      }),
    });

    if (!dalleResponse.ok) {
      const errData = await dalleResponse.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `DALL-E API error: ${dalleResponse.status}`;

      if (dalleResponse.status === 401) {
        return errorResponse('Invalid OpenAI API key. Please check your key in Settings.', 401);
      }
      if (dalleResponse.status === 429) {
        return errorResponse('OpenAI rate limit exceeded. Please wait and try again.', 429);
      }
      if (dalleResponse.status === 400 && errMsg.includes('billing')) {
        return errorResponse('OpenAI billing issue. Please check your OpenAI account has API credits.', 402);
      }

      return errorResponse(errMsg, dalleResponse.status);
    }

    const dalleData = await dalleResponse.json();
    const imageB64 = dalleData.data?.[0]?.b64_json;

    if (!imageB64) {
      return errorResponse('No image data received from DALL-E', 500);
    }

    // Convert base64 to binary and upload to R2
    const imageBytes = Uint8Array.from(atob(imageB64), c => c.charCodeAt(0));
    const portraitId = crypto.randomUUID();
    const key = `user-uploads/${userId}/npc-portraits/${portraitId}.png`;

    await env.STORAGE.put(key, imageBytes, {
      httpMetadata: {
        contentType: 'image/png',
      },
    });

    const publicUrl = `https://pub-fcd553bb197a4935b7e97601f28e1bc0.r2.dev/${key}`;

    // Save portrait metadata to Firestore
    const portraitDoc = {
      npcName: npcData.name,
      ancestry: npcData.ancestry || '',
      sex: npcData.sex || '',
      occupation: npcData.occupation?.name || npcData.occupation || '',
      imageUrl: publicUrl,
      key: key,
      size: imageBytes.length,
      createdAt: new Date().toISOString(),
    };

    await setFirestoreDoc(`users/${userId}/npc-portraits/${portraitId}`, portraitDoc, env);

    // Update storage usage
    const usage = userDoc?.usage || { storageBytes: 0 };
    await setFirestoreDoc(`users/${userId}`, {
      ...userDoc,
      usage: {
        storageBytes: (usage.storageBytes || 0) + imageBytes.length,
        lastUpdated: new Date().toISOString(),
      },
    }, env);

    return jsonResponse({
      success: true,
      portraitId,
      imageUrl: publicUrl,
      npcName: npcData.name,
    });
  } catch (err) {
    console.error('Portrait generation error:', err);
    return errorResponse('Failed to generate portrait: ' + err.message, 500);
  }
}

async function listPortraits(env, userId, { jsonResponse, errorResponse }) {
  try {
    const portraits = await listFirestoreDocs(`users/${userId}/npc-portraits`, env);
    return jsonResponse({
      portraits: (portraits || []).map(p => ({
        id: p.id,
        npcName: p.npcName,
        ancestry: p.ancestry,
        sex: p.sex,
        occupation: p.occupation,
        imageUrl: p.imageUrl,
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    console.error('List portraits error:', err);
    return errorResponse('Failed to list portraits', 500);
  }
}

async function deletePortrait(env, userId, portraitId, userDoc, { jsonResponse, errorResponse }) {
  try {
    const portraitDoc = await getFirestoreDoc(`users/${userId}/npc-portraits/${portraitId}`, env);
    if (!portraitDoc) {
      return errorResponse('Portrait not found', 404);
    }

    // Delete from R2
    if (portraitDoc.key) {
      await env.STORAGE.delete(portraitDoc.key);
    }

    // Update storage usage
    if (portraitDoc.size) {
      const usage = userDoc?.usage || { storageBytes: 0 };
      const newBytes = Math.max(0, (usage.storageBytes || 0) - portraitDoc.size);
      await setFirestoreDoc(`users/${userId}`, {
        ...userDoc,
        usage: {
          storageBytes: newBytes,
          lastUpdated: new Date().toISOString(),
        },
      }, env);
    }

    // Delete Firestore metadata
    await deleteFirestoreDoc(`users/${userId}/npc-portraits/${portraitId}`, env);

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Delete portrait error:', err);
    return errorResponse('Failed to delete portrait', 500);
  }
}
