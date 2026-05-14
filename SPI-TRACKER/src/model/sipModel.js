const client = require("../pgManager");

function insertNewSip(
  portfolio_id,
  fund_id,
  sip_amount,
  sip_date,
  start_date,
  end_date,
  status,
) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO sip_registration (
        portfolio_id,
        fund_id,
        sip_amount,
        sip_date,
        start_date,
        end_date,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING sip_id
    `;

    client.query(
      query,
      [
        portfolio_id,
        fund_id,
        sip_amount,
        sip_date,
        start_date,
        end_date,
        status,
      ],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            sip_id: res.rows[0].sip_id,
          });
        }
      },
    );
  });
}

function getSip(sipId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        s.sip_id,
        s.sip_amount,
        s.sip_date,
        s.start_date,
        s.end_date,
        s.status,

        mf.fund_name,

        p.portfolio_name

      FROM sip_registration s

      JOIN mutual_fund mf
      ON mf.fund_id = s.fund_id

      JOIN portfolio p
      ON p.portfolio_id = s.portfolio_id

      WHERE s.sip_id = $1
    `;

    client.query(query, [sipId], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

function processNewSip(sipId) {
  return new Promise((resolve, reject) => {
    client.query("BEGIN", (err) => {
      if (err) {
        return reject(err);
      }

      const fetchQuery = `
        SELECT 
          s.sip_id,
          s.portfolio_id,
          s.fund_id,
          s.sip_amount,
          mf.current_nav

        FROM sip_registration s

        JOIN mutual_fund mf
        ON mf.fund_id = s.fund_id

        WHERE s.sip_id = $1
      `;

      client.query(fetchQuery, [sipId], (err, result) => {
        if (err) {
          return client.query("ROLLBACK", () => {
            reject(err);
          });
        }

        const sip = result.rows[0];

        if (!sip) {
          return client.query("ROLLBACK", () => {
            reject(new Error("SIP not found"));
          });
        }

        const unitsAllocated = sip.sip_amount / sip.current_nav;

        const insertQuery = `
          INSERT INTO investment_transaction (
            sip_id,
            portfolio_id,
            fund_id,
            transaction_amount,
            nav_at_purchase,
            units_allocated,
            transaction_date,
            transaction_type
          )
          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7)
          RETURNING transaction_id
        `;

        client.query(
          insertQuery,
          [
            sip.sip_id,
            sip.portfolio_id,
            sip.fund_id,
            sip.sip_amount,
            sip.current_nav,
            unitsAllocated,
            "SIP",
          ],
          (err, insertResult) => {
            if (err) {
              return client.query("ROLLBACK", () => {
                reject(err);
              });
            }

            client.query("COMMIT", (err) => {
              if (err) {
                return client.query("ROLLBACK", () => {
                  reject(err);
                });
              }

              resolve({
                message: "SIP processed successfully",
                transaction_id: insertResult.rows[0].transaction_id,
                units_allocated: unitsAllocated,
              });
            });
          },
        );
      });
    });
  });
}

function getSipTransactionByID(sipId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        transaction_id,
        transaction_amount,
        nav_at_purchase,
        units_allocated,
        transaction_date,
        transaction_type

      FROM investment_transaction

      WHERE sip_id = $1
    `;

    client.query(query, [sipId], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
}

function getAllSips() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        s.sip_id,
        s.portfolio_id,
        s.fund_id,
        s.sip_amount,
        s.sip_date,
        s.start_date,
        s.end_date,
        s.status,
        mf.fund_name,
        p.portfolio_name,
        p.investor_id,
        i.email AS investor_email
      FROM sip_registration s
      JOIN mutual_fund mf ON mf.fund_id = s.fund_id
      JOIN portfolio p ON p.portfolio_id = s.portfolio_id
      JOIN investor i ON i.investor_id = p.investor_id
    `;

    client.query(query, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
}

module.exports = {
  insertNewSip,
  getSip,
  processNewSip,
  getAllSips,
  getSipTransactionByID,
};
