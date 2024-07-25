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
}); // 풍규

router.get("/sugardiary", (req, res) => {
    res.render("sugardiary");
<<<<<<< HEAD
});
=======
}); // 풍규

router.get("/mealrecord", (req, res) => {
    res.render("mealrecord");
}); // 풍규

>>>>>>> 3bb9a1f12fc79aafa2f7bbda229370664d98094b
router.get("/recipe_details", (req, res) => {
    res.render("recipe_details");
});
router.get("/mealrecord", (req,res)=> {
    res.render("mealrecord") ;
}); // 풍규 
router.get("/report/:type", (req, res) => {
    res.render("report");
});
router.get("/recipe_list", (req, res) => {
    res.render("recipe_list");
});

module.exports = router;
