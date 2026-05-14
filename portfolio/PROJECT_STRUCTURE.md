# Portfolio Frontend Structure

This frontend uses a clean App Router layout and groups files by purpose.

## Top level

- `app/` - Next.js App Router pages, layout, components, contexts, and utilities
- `public/` - Static assets
- `middleware.js` - Route protection
- `next.config.mjs` - Next.js configuration

## `app/`

- `app/(auth)/` - Authentication routes
- `app/dashboard/` - Dashboard page
- `app/investor-details/` - Investor details page
- `app/components/`
  - `auth/` - Auth-specific components
  - `dashboard/` - Dashboard widgets
  - `layout/` - Shared layout/header/footer pieces
  - `ui/` - Small reusable UI components
- `app/core/`
  - `contexts/` - React contexts
  - `providers/` - Context providers
- `app/lib/` - API and auth helpers

## Notes

- Generated folders like `.next/` and `node_modules/` should stay untracked.
- Prefer adding new shared components under `app/components/ui/` or `app/components/layout/`.
