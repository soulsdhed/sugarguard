const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticateToken");

router.get("/", authenticateToken, (req, res, next) => {
    // res.render("main");
    // TODO : api 5개를 1개로 합칠 것 (mypage, 기록 페이지)
});

module.exports = router;
