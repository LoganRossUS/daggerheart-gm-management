export async function verifyIdToken(token, env) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    }
  );

  if (!response.ok) {
    throw new Error('Invalid token');
  }

  const data = await response.json();
  if (!data.users || data.users.length === 0) {
    throw new Error('User not found');
  }

  return data.users[0];
}

function getFirestoreUrl(env, path) {
  return `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`;
}

async function getAccessToken(env) {
  const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/datastore',
  };

  // Sign JWT with service account private key
  const header = { alg: 'RS256', typ: 'JWT' };
  const jwt = await signJwt(header, payload, serviceAccount.private_key);

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

export async function getFirestoreDoc(path, env) {
  const accessToken = await getAccessToken(env);

  const response = await fetch(getFirestoreUrl(env, path), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Firestore read failed: ${response.status}`);
  }

  const doc = await response.json();
  return parseFirestoreDoc(doc);
}

export async function setFirestoreDoc(path, data, env) {
  const accessToken = await getAccessToken(env);

  const response = await fetch(getFirestoreUrl(env, path), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });

  if (!response.ok) {
    throw new Error(`Firestore write failed: ${response.status}`);
  }

  return response.json();
}

export async function deleteFirestoreDoc(path, env) {
  const accessToken = await getAccessToken(env);

  const response = await fetch(getFirestoreUrl(env, path), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Firestore delete failed: ${response.status}`);
  }

  return true;
}

export async function listFirestoreDocs(collectionPath, env) {
  const accessToken = await getAccessToken(env);

  const response = await fetch(getFirestoreUrl(env, collectionPath), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Firestore list failed: ${response.status}`);
  }

  const data = await response.json();
  return (data.documents || []).map(parseFirestoreDoc);
}

// Helper functions for Firestore data conversion
function parseFirestoreDoc(doc) {
  if (!doc.fields) return null;

  const result = { id: doc.name.split('/').pop() };

  for (const [key, value] of Object.entries(doc.fields)) {
    result[key] = parseFirestoreValue(value);
  }

  return result;
}

function parseFirestoreValue(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return parseInt(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return new Date(value.timestampValue);
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(parseFirestoreValue);
  if ('mapValue' in value) return parseFirestoreDoc({ fields: value.mapValue.fields });
  if ('nullValue' in value) return null;
  return null;
}

function toFirestoreFields(obj) {
  const fields = {};

  for (const [key, value] of Object.entries(obj)) {
    fields[key] = toFirestoreValue(value);
  }

  return fields;
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: value.toString() }
      : { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }
  return { nullValue: null };
}

// JWT signing helper (uses Web Crypto API)
async function signJwt(header, payload, privateKey) {
  const encoder = new TextEncoder();

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  // Import private key
  const pemContents = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signingInput)
  );

  const signatureB64 = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));

  return `${signingInput}.${signatureB64}`;
}

function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
