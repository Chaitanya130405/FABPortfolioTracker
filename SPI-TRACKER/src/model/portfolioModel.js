const client = require("../pgManager");

function getAllPortfolios() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        p.portfolio_id,
        p.investor_id,
        p.portfolio_name,
        p.created_at,
        i.first_name,
        i.middle_name,
        i.last_name,
        i.email,
        i.phone
      FROM portfolio p
      JOIN investor i
      ON i.investor_id = p.investor_id
      ORDER BY p.portfolio_id DESC
    `;

    client.query(query, [], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
}

module.exports = {
  getAllPortfolios,
};
