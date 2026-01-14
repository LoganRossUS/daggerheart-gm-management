# Daggerheart GM Management

A virtual tabletop tool for Daggerheart GMs featuring encounter management, battle maps, dice rolling, and player displays.

## Features

- **GM Control Panel** - Manage encounters, fear tracker, dice rolls, and NPC portraits
- **Player Display** - Show fear tracker, dice results, and spotlighted adversaries to players
- **Battle Map** - Display tactical maps with token positioning
- **Encounter Generator** - Build balanced encounters using the battle points system
- **Real-time Sync** - Connect GM and player displays via room codes

## Tier System

| Tier | Auth Required | Features |
|------|---------------|----------|
| Demo | No | Full app functionality, no cloud persistence |
| Basic | Yes | Cloud save, campaigns, notes, 250MB storage |
| Premium | Yes | Basic + community battlemap repository (coming soon) |

## Architecture

| Component | Service | Notes |
|-----------|---------|-------|
| Static Frontend | Cloudflare Pages | Vanilla JS, no build step |
| Backend API | Cloudflare Workers | Serverless functions |
| Auth | Firebase Auth | Google OAuth |
| Database | Firestore | User data, campaigns, notes |
| Live Sync | Firebase Realtime DB | Room-based sync |
| File Storage | Cloudflare R2 | Battlemaps, images |
| CI/CD | GitHub Actions | Deploys Pages + Workers |

## Development

### Prerequisites

- Node.js 20+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account
- Firebase project

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Create a Realtime Database
5. Create a service account and download the JSON key
6. Update the Firebase config in `public/js/lib/auth.js`

### Local Development

1. Clone the repository
2. Copy `workers/.dev.vars.example` to `workers/.dev.vars`
3. Fill in your Firebase credentials:
   ```
   FIREBASE_API_KEY=your-api-key
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```

4. Run the Workers development server:
   ```bash
   cd workers
   wrangler dev
   ```

5. In another terminal, serve the frontend:
   ```bash
   npx serve public
   ```

Or run both together:
```bash
wrangler pages dev public --binding STORAGE=daggerheart-uploads
```

### Project Structure

```
daggerheart-gm-management/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── public/                     # Static frontend
│   ├── index.html              # Landing page
│   ├── gm-control-panel-simplified.html
│   ├── encounter-generator.html
│   ├── battle-map.html
│   ├── player-display.html
│   ├── daggerheart_creatures.json
│   ├── js/
│   │   ├── app.js              # Cloud features integration
│   │   ├── lib/
│   │   │   ├── auth.js         # Firebase auth wrapper
│   │   │   ├── api.js          # API client
│   │   │   ├── entitlements.js # User entitlements
│   │   │   └── features.js     # Feature flags
│   │   └── components/
│   │       └── notes.js        # Notes component
│   └── assets/
│       └── images/
├── workers/                    # Cloudflare Workers API
│   ├── src/
│   │   ├── index.js            # Main router
│   │   ├── routes/
│   │   │   ├── auth.js         # Auth endpoints
│   │   │   ├── campaigns.js    # Campaign CRUD
│   │   │   └── upload.js       # File uploads
│   │   └── lib/
│   │       └── firebase.js     # Firebase Admin client
│   ├── wrangler.toml           # Wrangler config
│   └── .dev.vars.example       # Example secrets
├── firebase/
│   ├── firestore.rules         # Firestore security rules
│   └── database.rules.json     # Realtime DB rules
└── README.md
```

### Deployment

Push to `main` branch to trigger GitHub Actions deployment.

### GitHub Secrets Required

Set these in your repository settings:

- `CLOUDFLARE_API_TOKEN` - API token with Workers and Pages permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

### Cloudflare Secrets Required

Set these via `wrangler secret put`:

```bash
wrangler secret put FIREBASE_API_KEY
wrangler secret put FIREBASE_PROJECT_ID
wrangler secret put FIREBASE_SERVICE_ACCOUNT
```

## Security Model

Client-side code is public. Security is enforced by:

1. Firebase Security Rules block direct database writes
2. Cloudflare Workers validate Firebase ID tokens
3. Workers check entitlements before any operation
4. Workers hold all secrets (Firebase Admin credentials, R2 keys)
5. Client never has direct write access to user data

## Firestore Data Model

```
users/{userId}/
├── profile: {
│     email: string,
│     displayName: string,
│     createdAt: timestamp
│   }
├── entitlement: {
│     tier: 'basic' | 'premium',
│     grantedAt: timestamp,
│     expiresAt: timestamp | null
│   }
├── usage: {
│     storageBytes: number,
│     lastUpdated: timestamp
│   }
└── campaigns/{campaignId}/
    ├── name: string
    ├── createdAt: timestamp
    ├── updatedAt: timestamp
    ├── encounter: { ... }
    └── notes/{noteId}: {
          title: string,
          content: string,
          category: string,
          createdAt: timestamp,
          updatedAt: timestamp
        }
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/verify | Verify token and get user profile |
| GET | /api/campaigns | List user's campaigns |
| POST | /api/campaigns | Create new campaign |
| GET | /api/campaigns/:id | Get campaign with notes |
| PUT | /api/campaigns/:id | Update campaign |
| DELETE | /api/campaigns/:id | Delete campaign |
| POST | /api/upload | Request file upload URL |

## License

MIT
