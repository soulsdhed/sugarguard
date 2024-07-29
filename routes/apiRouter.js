const express = require("express");
const router = express.Router();
// const db = require("../conf/db");

const authRouter = require("./api/auth");
const userRouter = require("./api/user");
const recipeRouter = require("./api/recipe");
const excerciseRouter = require("./api/exerciselog");
const bloodsugarRouter = require("./api/bloodlog");
const weightRouter = require("./api/wieghtlog");
const bloodPressureRouter = require("./api/bloodpressurelog");
const mealRouter = require("./api/meallog");
const giRouter = require("./api/gi.js");
const foodNutritionRouter = require("./api/foodnutrition.js");
const chartRouter = require("./api/chart");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/recipes", recipeRouter);
router.use("/exercise-logs", excerciseRouter);
router.use("/blood-sugar-logs", bloodsugarRouter);
router.use("/weight-logs", weightRouter);
router.use("/blood-pressure-logs", bloodPressureRouter);
router.use("/meal-logs", mealRouter);
router.use("/gi", giRouter);
router.use("/food-nutrition", foodNutritionRouter);
router.use("/chart", chartRouter);

module.exports = router;
