const express = require("express");
const { verifyJWT } = require("../utility/authManager");
const {
  login,
  allinvestors,
  investorById,
  investorHoldings,
  investorNetworth,
  insertInvestor,
} = require("../controller/investorController");
const router = express.Router();

router.post("/investor/login", login);
router.post("/investor", insertInvestor);
router.get("/investors", allinvestors);
router.get(
  "/investor/:investorId",
  (request, response, next) => {
    const token = request.headers.authorization;
    try {
      const payload = verifyJWT(token);
      if (payload) {
        next();
      } else {
        return response.json("Invalid Permissions");
      }
    } catch (e) {
      console.log(`Error verifying token: ${e}`);
      response.json(e);
    }
  },
  investorById,
);

router.get(
  "/investor/:investorId/holdings",
  (request, response, next) => {
    const token = request.headers.authorization;
    try {
      const payload = verifyJWT(token);
      if (payload) {
        next();
      } else {
        return response.json("Invalid Permissions");
      }
    } catch (e) {
      console.log(`Error verifying token: ${e}`);
      response.json(e);
    }
  },
  investorHoldings,
);

router.get(
  "/investor/:investorId/networth",
  (request, response, next) => {
    const token = request.headers.authorization;
    try {
      const payload = verifyJWT(token);
      if (payload) {
        next();
      } else {
        return response.json("Invalid Permissions");
      }
    } catch (e) {
      console.log(`Error verifying token: ${e}`);
      response.json(e);
    }
  },
  investorNetworth,
);

module.exports = router;
