# FAB Portfolio Tracker

Frontend for the FAB Portfolio Tracker investment dashboard. This app handles investor sign-in, route protection, and the dashboard UI for viewing SIP, fund, and portfolio data.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS
- Lucide React icons

## Features

- Investor login with email and phone number
- Protected routes for dashboard and investor details
- Session persistence through cookie and localStorage
- API client with configurable backend base URL

## Getting Started

Install dependencies and run the frontend in development mode:

```bash
npm install
npm run dev
```

The app runs on [http://localhost:3001](http://localhost:3001).

## Backend Requirement

This frontend expects the API server from the `SPI-TRACKER` project to be running separately.

- Default API base URL: `http://localhost:5000`
- Optional environment variable: `NEXT_PUBLIC_API_BASE_URL`

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Available Scripts

```bash
npm run dev
npm run build
npm start
```

## Project Structure

- `app/` - App Router pages, layouts, middleware, and global styles
- `app/components/` - Reusable UI, auth, layout, and dashboard components
- `app/core/` - Context and provider logic
- `app/lib/` - API helpers and auth session utilities

## Routes

- `/login` - Investor sign-in page
- `/dashboard` - Main authenticated dashboard
- `/investor-details` - Investor detail view

## Notes

- The root route redirects to `/dashboard`.
- Unauthenticated users are redirected to `/login` by middleware.
- The login page now shows only the form, without the left branding panel.
