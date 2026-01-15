import { handleAuth } from './routes/auth.js';
import { handleCampaigns } from './routes/campaigns.js';
import { handleUpload } from './routes/upload.js';
import { handleAccount } from './routes/account.js';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    try {
      // Route matching
      if (path.startsWith('/api/auth')) {
        return handleAuth(request, env, { jsonResponse, errorResponse });
      }
      if (path.startsWith('/api/campaigns')) {
        return handleCampaigns(request, env, { jsonResponse, errorResponse });
      }
      if (path.startsWith('/api/upload')) {
        return handleUpload(request, env, { jsonResponse, errorResponse });
      }
      if (path.startsWith('/api/account')) {
        return handleAccount(request, env, { jsonResponse, errorResponse });
      }

      return errorResponse('Not Found', 404);
    } catch (err) {
      console.error('Worker error:', err);
      return errorResponse('Internal Server Error', 500);
    }
  },
};
