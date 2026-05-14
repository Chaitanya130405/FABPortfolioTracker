const { signJWT } = require("../utility/authManager");

const {
  insertNewSip,
  getSip,
  processNewSip,
  getSipTransactionByID,
  getAllSips,
} = require("../model/sipModel");

const insertSip = async (request, response) => {
  const {
    portfolio_id,
    fund_id,
    sip_amount,
    sip_date,
    start_date,
    end_date,
    status,
  } = request.body;

  if (!portfolio_id || !sip_amount || !sip_date) {
    return response.status(400).json({ message: "All fields are required" });
  }

  const result = await insertNewSip(
    portfolio_id,
    fund_id,
    sip_amount,
    sip_date,
    start_date,
    end_date,
    status,
  );
  return response.json(result);
};

const getSipById = async (request, response) => {
  const sipId = request.params.sipId;
  const result = await getSip(sipId);
  return response.json(result);
};

const processSip = async (request, response) => {
  const sipId = request.params.sipId;
  const result = await processNewSip(sipId);
  return response.json(result);
};

const getSipTransaction = async (request, response) => {
  const sipId = request.params.sipId;
  const result = await getSipTransactionByID(sipId);
  return response.json(result);
};

const getAll = async (request, response) => {
  const result = await getAllSips();
  return response.json(result);
};

module.exports = {
  insertSip,
  getSipById,
  processSip,
  getSipTransaction,
  getAll,
};
