const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("main");
});

router.get("/mypage", (req, res) => {
    res.render("mypage");
}); //김진

router.get("/login", (req, res) => {
    res.render("login");
}); //김진

router.get("/join", (req, res) => {
    res.render("join");
}); //김진

router.get("/recipe", (req, res) => {
    res.render("recipe");
});

router.get("/sugardiary", (req, res) => {
    res.render("sugardiary");
});

router.get("/recipe_details", (req, res) => {
    res.render("recipe_details");
});

router.get("/report/:type", (req, res) => {
    res.render("report");
});

module.exports = router;
