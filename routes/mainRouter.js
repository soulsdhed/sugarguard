const express = require("express");
const router = express.Router();
const { getUserIdInRefreshToken } = require("../utils/jwt");

router.get("/", (req, res) => {
    res.render("main", { title: "main", currentPage: "/" });
});

router.get("/mypage", async (req, res) => {
    console.log("mypage router", await getUserIdInRefreshToken(req));
    res.render("mypage", {
        userId: await getUserIdInRefreshToken(req),
        title: "Mypage",
        currentPage: "/mypage",
    });
});

router.get("/login", async (req, res) => {
    res.render("login", { userId: await getUserIdInRefreshToken(req) });
});

router.get("/join", (req, res) => {
    res.render("join");
});

router.get("/recipe", async (req, res) => {
    res.render("recipe", { userId: await getUserIdInRefreshToken(req) });
});

router.get("/sugardiary", (req, res) => {
    res.render("sugardiary");
});

router.get("/recipe_details", (req, res) => {
    res.render("recipe_details");
});

router.get("/mealrecord", (req, res) => {
    res.render("mealrecord");
});

router.get("/report/:type", (req, res) => {
    res.render("report");
});
router.get("/recipe_list", (req, res) => {
    res.render("recipe_list", {
        title: "Recipe_List",
        currentPage: "/recipe_list",
    });
});

router.get("/bs", (req, res) => {
    res.render("bs");
}); // 김희은

router.get("/exercise1", (req, res) => {
    res.render("exercise1");
}); // 김희은

router.get("/foodnutrition", (req, res) => {
    res.render("foodnutrition");
}); // 음식영양정보 풍규


module.exports = router;
