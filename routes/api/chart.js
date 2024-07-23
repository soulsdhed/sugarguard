const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");

// TODO :
// 차트 주별 월별
router.get("/", authenticateToken, (req, res, next) => {
    //
});

module.exports = router;
