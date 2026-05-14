const express = require("express");
const {
  InsertFunds,
  allFunds,
  updateFundNav,
} = require("../controller/fundController");
const router = express.Router();

router.post("/fund", InsertFunds);
router.get("/funds", allFunds);
router.patch("/fund/:fundId/nav", updateFundNav);

module.exports = router;
