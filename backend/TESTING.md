# Backend API Testing

## Prerequisites

1. Start the backend with `npm run dev`.
2. Obtain a valid Clerk session token from the frontend.
3. Use `curl`, Postman, or another HTTP client.

Authenticated requests use:

```text
Authorization: Bearer <clerk-session-token>
```

## Health Check

```bash
curl http://localhost:3001/health
```

This endpoint does not require authentication.

## Authentication

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <clerk-session-token>"
```

## Notes

Create a note:

```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Note","content":"Note content"}'
```

List notes:

```bash
curl http://localhost:3001/api/notes \
  -H "Authorization: Bearer <clerk-session-token>"
```

Get, update, or delete a note by replacing `NOTE_ID`:

```bash
curl http://localhost:3001/api/notes/NOTE_ID \
  -H "Authorization: Bearer <clerk-session-token>"

curl -X PATCH http://localhost:3001/api/notes/NOTE_ID \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"Updated content"}'

curl -X DELETE http://localhost:3001/api/notes/NOTE_ID \
  -H "Authorization: Bearer <clerk-session-token>"
```

## AI

Summarize text:

```bash
curl -X POST http://localhost:3001/api/ai/summarize \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"text":"Long text to summarize"}'
```

Rewrite text:

```bash
curl -X POST http://localhost:3001/api/ai/rewrite \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"text":"Text to rewrite","mode":"formal"}'
```

Translate text:

```bash
curl -X POST http://localhost:3001/api/ai/translate \
  -H "Authorization: Bearer <clerk-session-token>" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}'
```

## Verification Checklist

- Health check succeeds without authentication.
- Invalid or missing tokens return `401`.
- Notes are limited to the authenticated user.
- Note CRUD operations work.
- Summarization, rewriting, and translation return results with a valid
  `GEMINI_API_KEY`.
