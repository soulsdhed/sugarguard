const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("main");
});

router.get("/mypage", (req, res) => {
    res.render("mypage");
});//김진

router.get("/login", (req, res) => {
    res.render("login");
});//김진

router.get("/recipe", (req, res) => {
    res.render("recipe");
});

router.get("/sugardiary", (req, res) => {
    res.render("sugardiary");
});

module.exports = router;
