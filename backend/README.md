# Maswada AI Backend

REST API for the Maswada AI note-taking application.

## Stack

- Node.js and TypeScript
- Express
- SQLite with Sequelize
- Clerk authentication
- Zod validation
- Google Gemini through `@google/genai`

## Setup

```bash
npm install
cp .env.example .env
npm run db:sync
npm run dev
```

The server runs at `http://localhost:3001` by default.

Configure these values in `.env`:

- `CLERK_SECRET_KEY`
- `FRONTEND_ORIGIN` (defaults to `http://localhost:5173`)
- `PORT` (defaults to `3001`)
- `SQLITE_PATH` (defaults to `./data/maswada.db`)
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional)

## Scripts

- `npm run dev` - Start with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start the compiled server
- `npm run db:sync` - Create or update database tables

## API

### Public

- `GET /health` - Health check

### Authenticated

All authenticated endpoints require a valid Clerk bearer token:

```text
Authorization: Bearer <clerk-session-token>
```

- `GET /api/auth/me` - Verify the current session
- `GET /api/notes` - List the current user's notes
- `POST /api/notes` - Create a note
- `GET /api/notes/:id` - Get a note
- `PATCH /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `POST /api/ai/summarize` - Summarize text or a note
- `POST /api/ai/rewrite` - Rewrite text in comedy, formal, or casual style
- `POST /api/ai/translate` - Translate between English and Arabic

## Note Model

```typescript
{
  id: string;
  userId: string;
  title: string;
  content: string;
  language: 'en' | 'ar';
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Security

- Clerk tokens are verified before protected routes execute.
- Database queries are scoped to the authenticated `userId`.
- Request bodies are validated with Zod.
- Errors are handled centrally by `src/middlewares/errorHandler.ts`.

See [AI_FEATURES.md](./AI_FEATURES.md) for Gemini behavior and
[TESTING.md](./TESTING.md) for API examples.

## Docker Deployment

For a local backend test, create `backend/.env` with development credentials
and run from the repository root:

```bash
docker compose up --build -d
docker compose run --rm backend npm run db:sync
```

The API is then available at `http://localhost:3001`. Check it with:

```bash
curl http://localhost:3001/health
```

For deployment, set `FRONTEND_ORIGIN` to the URL where the frontend is hosted,
set `DOMAIN` to the public API hostname, create a DNS record for that hostname,
and use the production overlay:

```text
api.example.com.  A  <server-public-ip>
```

The server must allow inbound TCP traffic on ports 80 and 443. Verify DNS
before deploying:

```bash
export DOMAIN=api.example.com
dig +short A "$DOMAIN"
```

The command must return the server's public IP. Then start the production
overlay:

```bash
# Build the backend image
docker compose -f compose.yaml -f compose.production.yaml build

# Apply the database schema before starting the API
docker compose -f compose.yaml -f compose.production.yaml run --rm backend node dist/db/sync.js

# Start the backend and Caddy
docker compose -f compose.yaml -f compose.production.yaml up -d
```

Caddy terminates HTTPS and proxies `https://$DOMAIN` to the backend. It obtains
and renews the certificate automatically. The SQLite database is persisted in
the `maswada_data` Docker volume.
