# AI Features

Maswada AI uses Google Gemini through the `@google/genai` SDK.

## Configuration

Set these values in `backend/.env`:

```text
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

The model setting is optional and can be changed without modifying application
code.

## Capabilities

### Summarize

Creates a concise summary in the input language. Requests can contain either
text or an existing note ID.

### Rewrite

Rewrites text while preserving its language. Supported modes are:

- `comedy`
- `formal`
- `casual`

### Translate

Automatically detects the input language and translates between English and
Arabic.

## Endpoints

All endpoints require a valid Clerk bearer token.

### `POST /api/ai/summarize`

```json
{
  "text": "Text to summarize"
}
```

### `POST /api/ai/rewrite`

```json
{
  "text": "Text to rewrite",
  "mode": "formal"
}
```

### `POST /api/ai/translate`

```json
{
  "text": "Hello world"
}
```

## Errors

The service reports missing configuration, provider failures, rate limits, and
invalid provider responses through the API error handler.
