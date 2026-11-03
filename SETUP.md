# Maswada AI Setup

## Requirements

- Node.js 18 or newer
- A Clerk application
- A Google Gemini API key

## Configure Credentials

### Clerk

1. Create an application at [clerk.com](https://clerk.com).
2. Copy the publishable key for the frontend.
3. Copy the secret key for the backend.

### Google Gemini

1. Create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Keep the key private and add it only to `backend/.env`.

## Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set these values in `backend/.env`:

```text
CLERK_SECRET_KEY=sk_test_...
FRONTEND_ORIGIN=http://localhost:5173
PORT=3001
SQLITE_PATH=./data/maswada.db
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash-lite
```

Initialize the database and start the development server:

```bash
npm run db:sync
npm run dev
```

The API is available at `http://localhost:3001`.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Set these values in `frontend/.env`:

```text
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
```

The application is available at `http://localhost:5173`.

## Verification

Check the backend:

```bash
curl http://localhost:3001/health
```

Then open `http://localhost:5173` and sign in to create a note.

## Troubleshooting

- Confirm the Clerk keys are set in the correct `.env` file.
- Confirm the backend is running before using the frontend.
- Confirm ports 3001 and 5173 are available.
- Run `npm run db:sync` from `backend` if the database has not been initialized.
- Run `npm run build` in either project to check TypeScript compilation.
