const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
require("dotenv").config();

function resolveDbPath(inputPath) {
  if (!inputPath || !inputPath.trim()) {
    return path.join(__dirname, "spi_tracker.db");
  }

  const normalized = inputPath.trim();
  return normalized;
}

const dbPath = resolveDbPath(process.env.SQLITE_DB_PATH);
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("SQLite connection error:", err);
  } else {
    console.log("SQLite connected:", dbPath);
  }
});

function normalizePlaceholders(sql) {
  return sql.replace(/\$\d+/g, "?");
}

function query(sql, params, callback) {
  const hasParams = Array.isArray(params);
  const cb = hasParams ? callback : params;
  const values = hasParams ? params : [];
  const normalizedSql = normalizePlaceholders(sql.trim());
  const upperSql = normalizedSql.toUpperCase();

  if (
    upperSql === "BEGIN" ||
    upperSql === "COMMIT" ||
    upperSql === "ROLLBACK"
  ) {
    return db.run(normalizedSql, (err) => cb(err, { rows: [], rowCount: 0 }));
  }

  if (upperSql.startsWith("SELECT")) {
    return db.all(normalizedSql, values, (err, rows) => {
      if (err) {
        return cb(err);
      }
      cb(null, { rows, rowCount: rows.length });
    });
  }

  const returningMatch = normalizedSql.match(/RETURNING\s+([\w\s,]+)/i);
  if (returningMatch) {
    const returningColumns = returningMatch[1]
      .split(",")
      .map((col) => col.trim())
      .filter(Boolean);
    const sqlWithoutReturning = normalizedSql.replace(
      /\s+RETURNING\s+[\w\s,]+\s*$/i,
      "",
    );

    return db.run(sqlWithoutReturning, values, function (err) {
      if (err) {
        return cb(err);
      }

      const row = {};
      for (const col of returningColumns) {
        row[col] = this.lastID;
      }

      cb.call({ lastID: this.lastID, changes: this.changes }, null, {
        rows: [row],
        rowCount: this.changes || 1,
      });
    });
  }

  return db.run(normalizedSql, values, function (err) {
    if (err) {
      return cb(err);
    }
    cb.call({ lastID: this.lastID, changes: this.changes }, null, {
      rows: [],
      rowCount: this.changes || 0,
    });
  });
}

module.exports = {
  query,
};
