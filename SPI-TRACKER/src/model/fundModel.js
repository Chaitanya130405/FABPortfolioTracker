const client = require("../pgManager");

function insertFund(
  amc_id,
  fund_name,
  fund_type,
  risk_level,
  current_nav,
  created_at,
) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO mutual_fund (
        amc_id,
        fund_name,
        fund_type,
        risk_level,
        current_nav,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING fund_id
    `;

    client.query(
      query,
      [amc_id, fund_name, fund_type, risk_level, current_nav, created_at],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            fund_id: res.rows[0].fund_id,
          });
        }
      },
    );
  });
}

function getAllFunds() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        mf.fund_id,
        mf.fund_name,
        mf.fund_type,
        mf.risk_level,
        mf.current_nav,
        a.amc_name

      FROM mutual_fund mf

      JOIN amc a
      ON a.amc_id = mf.amc_id
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

function updateFundNavv(fundId, newNav) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE mutual_fund
      SET current_nav = $1
      WHERE fund_id = $2
    `;

    client.query(query, [newNav, fundId], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          changes: res.rowCount,
        });
      }
    });
  });
}

module.exports = {
  insertFund,
  getAllFunds,
  updateFundNavv,
};
