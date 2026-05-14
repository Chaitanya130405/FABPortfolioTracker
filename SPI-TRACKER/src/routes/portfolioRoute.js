const express = require("express");
const { allPortfolios } = require("../controller/portfolioController");
const router = express.Router();

router.get("/portfolios", allPortfolios);

module.exports = router;
