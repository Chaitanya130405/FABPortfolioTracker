const express = require("express");
const { allTransactions } = require("../controller/transactionController");
const router = express.Router();

router.get("/transactions", allTransactions);

module.exports = router;
