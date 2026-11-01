# AI Features - Google Gemini Integration

## Overview

The backend now includes Google Gemini integration for all AI features through the `@google/genai` SDK.

## Architecture

**Direct Gemini Integration** - The AI service calls `geminiService` directly, using the configured Gemini model.

## Setup

### 1. Get Gemini Credentials

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a Gemini API key
4. Copy the key and keep it private

### 2. Configure Environment

```bash
# In backend/.env
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: choose a different Gemini model
GEMINI_MODEL=gemini-3.5-flash-lite
```

### 3. Restart Backend

```bash
npm run dev
```

You should see: `🤖 Gemini: Configured ✓`

## Features

### 1. Summarize
- **Model**: Configured through `GEMINI_MODEL`
- **Max Tokens**: 500
- **Language**: Auto-detects from input (English & Arabic)
- **Use Case**: Generate concise summaries of notes

### 2. Rewrite
- **Model**: Configured through `GEMINI_MODEL`
- **Max Tokens**: 1000
- **Modes**:
  - `comedy` - Humorous and entertaining tone
  - `formal` - Professional tone
  - `casual` - Conversational tone
- **Language**: Auto-detects from input (English & Arabic)

### 3. Translate
- **Model**: Configured through `GEMINI_MODEL`
- **Max Tokens**: 1000
- **Auto-Detection**: Detects source language and translates to the opposite
  - English → Arabic
  - Arabic → English
- **Quality**: Professional translation with Gemini

## API Endpoints

All endpoints require authentication (Bearer token).

### POST /api/ai/summarize
```json
{
  "text": "Your text to summarize..."
}
```

Or with a note:
```json
{
  "noteId": "uuid-of-existing-note"
}
```

Response stays in the same language as input.

### POST /api/ai/rewrite
```json
{
  "text": "Your text to rewrite...",
  "mode": "comedy"  // comedy | formal | casual
}
```

Response stays in the same language as input.

### POST /api/ai/translate
```json
{
  "text": "Hello world"
}
```

Auto-detects language and translates:
- English → Arabic
- Arabic → English

## Cost Estimation

The cost and capabilities depend on the Gemini model configured in `GEMINI_MODEL`.

Check current pricing at: https://ai.google.dev/gemini-api/docs/pricing

## Testing

Set `GEMINI_API_KEY` in `.env` and the service will make real API calls to Google Gemini.

## Error Handling

The service handles:
- Missing API key → Throws error on startup
- API errors → Returns error message
- Rate limits → Returns the Gemini API error response
- Invalid responses → Returns fallback message

## Models Used

The service uses the model in `GEMINI_MODEL` and defaults to `gemini-3.5-flash-lite`.
Change that environment variable to switch models without changing application code.

## Implementation Details

See `backend/src/services/gemini.service.ts` for the full implementation.

The service:
1. Initializes the Google GenAI client with the API key
2. Uses appropriate system prompts for each task
3. Handles language-specific instructions
4. Returns clean text responses
5. Falls back gracefully on errors

## Next Steps

1. ✅ Gemini provider implemented
2. ⏳ Test with real API key
3. ⏳ Integrate with frontend UI
4. ⏳ Add usage monitoring (optional)
5. ⏳ Consider response caching (optional)
