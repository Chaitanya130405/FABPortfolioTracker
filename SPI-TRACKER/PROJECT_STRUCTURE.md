SPI-TRACKER - Project structure (cleaned)

Top-level now contains runtime artifacts and configuration only. All JS source files live under `src/`.

- src/
  - server.js # App entry point
  - pgManager.js # SQLite wrapper
  - controller/ # Express request handlers
  - model/ # DB access layer
  - routes/ # Express routes
  - utility/ # Helpers (authManager)
- data/ # Persistent DB files (keep at repo root)
- .env # Environment variables (SQLITE_DB_PATH)
- package.json # start script now runs `nodemon src/server.js`

Notes:

- The relative require paths inside `src/` are preserved (e.g. `require('../model/...')`).
- To run the server locally: `npm run start` from the `SPI-TRACKER` folder.
