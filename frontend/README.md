# Maswada AI Frontend

The Maswada AI frontend is a React application for creating and managing
bilingual notes with AI-assisted writing tools.

## Stack

- React 19 with TypeScript
- Vite
- React Router
- Tailwind CSS
- `react-intl` for English and Arabic translations
- TanStack Query for API state

## Development

From this directory:

```bash
npm install
cp .env.example .env
npm run dev
```

Configure `frontend/.env` with:

```text
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:3001
```

The backend must be running for notes and AI features to work.

## Commands

- `npm run dev` - Start the Vite development server
- `npm run build` - Type-check and create a production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## UI Structure

- `src/app/` - Application routes, layouts, and pages
- `src/components/` - Shared UI components
- `src/hooks/` - API and application hooks
- `src/i18n/` - English and Arabic message catalogs
- `src/api/` - Backend API clients
