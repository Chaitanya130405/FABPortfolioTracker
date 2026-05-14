const client = require("../pgManager");

function loginUser(email, phone) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM investor WHERE email = $1 AND phone = $2";
    client.query(query, [email, phone], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

function insertNewInvestor(
  first_name,
  middle_name,
  last_name,
  email,
  phone,
  dob,
  gender,
  pan,
  aadhaar,
  occupation,
  created_at,
) {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO investor (
            first_name,
            middle_name,
            last_name,
            email,
            phone,
            dob,
            gender,
            pan,
            aadhaar,
            occupation,
            created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING investor_id
    `;
    client.query(
      query,
      [
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        dob,
        gender,
        pan,
        aadhaar,
        occupation,
        created_at,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ investor_id: this.lastID });
        }
      },
    );
  });
}

function getAllInvestors() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM investor";
    client.query(query, [], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
}

function getInvestorById(investorId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM investor WHERE investor_id = $1";
    client.query(query, [investorId], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

function getInvestorHoldings(investorId) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
            mf.fund_id,
            mf.fund_name,
            
            SUM(it.units_allocated) AS total_units,
            
            mf.current_nav,
            
            ROUND(
                SUM(it.units_allocated) * mf.current_nav,
                2
            ) AS current_value

        FROM investment_transaction it

        JOIN portfolio p
        ON p.portfolio_id = it.portfolio_id

        JOIN mutual_fund mf
        ON mf.fund_id = it.fund_id

        WHERE p.investor_id = $1

        GROUP BY 
            mf.fund_id, 
            mf.fund_name, 
            mf.current_nav
    `;

    client.query(query, [investorId], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
}

function getInvestorNetWorth(investorId) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
            i.investor_id,
            
            i.first_name || ' ' || i.last_name AS investor_name,

            ROUND(
                SUM(it.units_allocated * mf.current_nav),
                2
            ) AS networth

        FROM investor i

        JOIN portfolio p
        ON p.investor_id = i.investor_id

        JOIN investment_transaction it
        ON it.portfolio_id = p.portfolio_id

        JOIN mutual_fund mf
        ON mf.fund_id = it.fund_id

        WHERE i.investor_id = $1

        GROUP BY 
            i.investor_id,
            i.first_name,
            i.last_name
    `;

    client.query(query, [investorId], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

module.exports = {
  loginUser,
  insertNewInvestor,
  getAllInvestors,
  getInvestorHoldings,
  getInvestorById,
  getInvestorNetWorth,
};
