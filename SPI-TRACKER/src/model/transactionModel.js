const client = require("../pgManager");

function getAllTransactions() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        it.transaction_id,
        it.sip_id,
        it.portfolio_id,
        it.fund_id,
        it.transaction_amount,
        it.nav_at_purchase,
        it.units_allocated,
        it.transaction_date,
        it.transaction_type,
        s.sip_amount,
        p.portfolio_name,
        p.investor_id,
        i.email AS investor_email,
        mf.fund_name,
        mf.current_nav
      FROM investment_transaction it
      LEFT JOIN sip_registration s
      ON s.sip_id = it.sip_id
      LEFT JOIN portfolio p
      ON p.portfolio_id = it.portfolio_id
      LEFT JOIN investor i
      ON i.investor_id = p.investor_id
      LEFT JOIN mutual_fund mf
      ON mf.fund_id = it.fund_id
      ORDER BY it.transaction_id DESC
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
  getAllTransactions,
};
