const { getAllTransactions } = require("../model/transactionModel");

const allTransactions = async (request, response) => {
  const transactions = await getAllTransactions();
  return response.json(transactions);
};

module.exports = {
  allTransactions,
};
