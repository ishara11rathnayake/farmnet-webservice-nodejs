const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const complaintsController = require("../controllers/complaints");

router.post("/", checkAuth, complaintsController.complaints_create_conplaint);

module.exports = router;
