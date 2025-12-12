# Welcome to your Lovable project

## Project info
## Folder Structure Update

The project has been reorganized into `Frontend` and `Backend`:

- Frontend: app source and build tooling
	- `src/`, `public/`, `package.json`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig*`, `.env`, `.gitignore`, `node_modules`, and other app configs
- Backend: Supabase database assets
	- `supabase/` with `config.toml` and `migrations/`

Notes:
- Paths in any scripts or deploy workflows may need updating to reflect the new locations.
- If you run the dev server, do so from the `Frontend` folder.

### Run Frontend

From the `Frontend` directory:

```bash
npm install
npm run dev
```

### Backend (Supabase)

From the `Backend` directory you can manage Supabase locally if you use the CLI:

```bash
# Example (requires Supabase CLI installed)
supabase start
supabase migrations up
```


**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

# Sweet Harmony Manager Frontend

This is the React + Vite + TypeScript frontend for Sweet Harmony Manager.

## Getting Started

Prerequisites:
- Node.js (LTS) and npm installed.

Setup:
```sh
npm install
npm run dev
```

## Tech Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Project Structure
- `src/` application code
- `public/` static assets
- Configuration: `vite.config.ts`, `tailwind.config.ts`, `tsconfig*`

## Notes
- Environment variables are defined in `.env`.
- See the root repository README for backend and database details.
- Navigate to the desired file(s).
