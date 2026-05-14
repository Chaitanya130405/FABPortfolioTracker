# FAB Project Suite

This workspace contains two connected applications:

- `portfolio/` - the Next.js frontend for the investor dashboard
- `SPI-TRACKER/` - the Node.js/Express backend API with SQLite persistence

## Overview

FAB Portfolio Tracker is an investor management system for viewing and managing investors, SIPs, funds, portfolios, and transaction activity.

The frontend handles sign-in, protected routes, and dashboard presentation. The backend exposes the API used by the frontend and stores data in SQLite.

## Project Structure

- `portfolio/` - Next.js App Router frontend
- `SPI-TRACKER/` - Express API backend

## Frontend: `portfolio/`

### Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS
- Lucide React icons

### Key Features

- Investor login with email and phone number
- Protected dashboard and investor detail routes
- Session persistence through cookie and localStorage
- Configurable API base URL

### Run the Frontend

```bash
cd portfolio
npm install
npm run dev
```

The app runs on [http://localhost:3001](http://localhost:3001).

### Frontend Environment

Optional environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

If this is not set, the frontend defaults to `http://localhost:5000`.

## Backend: `SPI-TRACKER/`

### Tech Stack

- Node.js
- Express 5
- SQLite3
- JSON Web Tokens for authentication

### Key Features

- Investor authentication
- Fund, SIP, portfolio, and transaction APIs
- SQLite-backed data access layer
- JWT-protected investor endpoints

### Run the Backend

```bash
cd SPI-TRACKER
npm install
npm start
```

The API server runs on [http://localhost:5000](http://localhost:5000).

### Backend Environment

The backend uses a SQLite database path from environment configuration. Set the database location in `.env` before starting the server.

Example:

```bash
SQLITE_DB_PATH=D:\\Portfolio\\SipandPortfolioSystem
JWT_SECRET=your-secret-key
```

## Common Routes

### Frontend Routes

- `/login` - investor sign-in
- `/dashboard` - main dashboard
- `/investor-details` - investor detail view

### Backend API Groups

- `/api/investor`
- `/api/fund`
- `/api/portfolio`
- `/api/sip`
- `/api/transaction`

## Development Notes

- Start the backend before using the frontend login flow.
- The frontend redirects unauthenticated users to `/login`.
- The login page now shows only the form, without the left branding panel.
- The root route in the frontend redirects to `/dashboard`.

## Recommended Workflow

1. Start the backend in `SPI-TRACKER/`.
2. Start the frontend in `portfolio/`.
3. Open the frontend in the browser and sign in with an existing investor account.

## Scripts

### `portfolio/`

- `npm run dev` - start the development server on port 3001
- `npm run build` - build the frontend
- `npm start` - start the production frontend server

### `SPI-TRACKER/`

- `npm start` - start the backend via `src/server.js`

## Notes

- The backend keeps a compatibility wrapper at `SPI-TRACKER/server.js` for older startup commands.
- The database is SQLite-based, so table recreation can be done locally without a hosted database service.
<<<<<<< HEAD
=======



<img width="1904" height="935" alt="Screenshot 2026-05-14 101858" src="https://github.com/user-attachments/assets/2a82f743-3ce9-4efe-9c30-49aacca0d12c" />
<img width="1903" height="935" alt="Screenshot 2026-05-13 153004" src="https://github.com/user-attachments/assets/b47972b2-7afd-49d8-a7b0-6f4bb1d2f343" />
<img width="1915" height="923" alt="Screenshot 2026-05-14 114851" src="https://github.com/user-attachments/assets/04f36ab0-f223-4825-9fee-47f0d156656d" />
<img width="1919" height="931" alt="Screenshot 2026-05-14 114902" src="https://github.com/user-attachments/assets/6690f285-9a8d-4b39-86ab-4541a226fe0d" />



>>>>>>> 8ac2189c498637d66125154f97ab6c137e6e49ed
