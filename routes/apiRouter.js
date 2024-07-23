const express = require("express");
const router = express.Router();
// const db = require("../conf/db");

const userRouter = require("./api/user");
const recipeRouter = require("./api/recipe");
const excerciseRouter = require("./api/exerciselog");
const bloodsugarRouter = require("./api/bloodlog");
const mealRouter = require("./api/meallog");
const authRouter = require("./api/auth");
const chartRouter = require("./api/chart");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/recipes", recipeRouter);
router.use("/exercise-logs", excerciseRouter);
router.use("/blood-sugar-logs", bloodsugarRouter);
router.use("/meal-logs", mealRouter);
router.use("/chart", chartRouter);

module.exports = router;
