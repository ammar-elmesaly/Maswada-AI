# Maswada AI | المُسوَدَّة الذكية

Maswada AI is a bilingual note-taking application with secure authentication and
AI-powered summarization, rewriting, and translation.

## Features

- Create, edit, search, and delete notes
- English and Arabic interfaces with RTL support
- Clerk authentication
- Google Gemini-powered summarization, rewriting, and translation
- SQLite persistence through Sequelize
- Responsive React interface

## Tech Stack

### Backend

- Node.js, TypeScript, and Express
- SQLite with Sequelize
- Clerk token verification
- Zod request validation
- Google Gemini through `@google/genai`

### Frontend

- React 19 and TypeScript
- Vite
- React Router
- Tailwind CSS
- `react-intl`
- TanStack Query

## Project Structure

```text
maswada-ai/
├── backend/   # Express API and database services
├── frontend/  # React application
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- A Clerk application
- A Google Gemini API key

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set the required values in `backend/.env`, then initialize the database and
start the API:

```bash
npm run db:sync
npm run dev
```

The backend runs at `http://localhost:3001` by default.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_CLERK_PUBLISHABLE_KEY` and, if needed,
`VITE_API_BASE_URL` in `frontend/.env`. The frontend runs at
`http://localhost:5173` by default.

More detailed setup information is available in [SETUP.md](./SETUP.md).

## API Overview

### Public

- `GET /health` - Health check

### Authenticated

- `GET /api/auth/me` - Verify the current session
- `GET /api/notes` - List the current user's notes
- `POST /api/notes` - Create a note
- `GET /api/notes/:id` - Get a note
- `PATCH /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `POST /api/ai/summarize` - Summarize text or a note
- `POST /api/ai/rewrite` - Rewrite text in a selected style
- `POST /api/ai/translate` - Translate between English and Arabic

See [backend/README.md](./backend/README.md) and
[backend/TESTING.md](./backend/TESTING.md) for request details.

## Environment Variables

### Backend

```text
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
CLERK_SECRET_KEY=...
SQLITE_PATH=./data/maswada.db
GEMINI_API_KEY=...
GEMINI_MODEL=...
```

### Frontend

```text
VITE_CLERK_PUBLISHABLE_KEY=...
VITE_API_BASE_URL=http://localhost:3001
```

## Production

Build and run the backend:

```bash
cd backend
npm run build
npm start
```

Build the frontend with its production environment variables:

```bash
cd frontend
npm run build
```

## License

MIT
