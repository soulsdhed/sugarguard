const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("main", { title: "main", currentPage: "/" });
});

router.get("/mypage", (req, res) => {
    res.render("mypage", { title: "Mypage", currentPage: "/mypage" });
}); //김진

router.get("/login", (req, res) => {
    res.render("login");
}); //김진

router.get("/join", (req, res) => {
    res.render("join");
}); //김진

router.get("/recipe", (req, res) => {
    res.render("recipe");
}); // 풍규

router.get("/sugardiary", (req, res) => {
    res.render("sugardiary");
});
router.get("/recipe_details", (req, res) => {
    res.render("recipe_details");
});
router.get("/mealrecord", (req, res) => {
    res.render("mealrecord");
}); // 풍규
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
});
module.exports = router;
