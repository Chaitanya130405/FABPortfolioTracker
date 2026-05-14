const express = require("express");
const {
  insertSip,
  getSipById,
  processSip,
  getSipTransaction,
  getAll,
} = require("../controller/sipController");
const router = express.Router();

router.post("/sip", insertSip);
router.get("/sip/:sipId", getSipById);
router.post("/sip/:sipId/process", processSip);
router.get("/sip/:sipId/transactions", getSipTransaction);
router.get("/sips", getAll);

// Backwards-compatible alias for older frontend calls
router.get("/sips/all", getAll);

module.exports = router;
