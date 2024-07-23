const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");

// 레시피 추천 (jwt - 회원)
router.get("/", authenticateToken, (req, res, next) => {
    const {
        have,
        prefer,
        dislike,
        amount,
        time,
        difficult,
        count: queryCount = 10,
    } = req.query;

    // max count : 10
    const count = Math.min(parseInt(queryCount), 10);

    // 재료를 ,를 기준으로 분리 (공백 제거)
    const haveIngredients = have
        ? have.split(",").map((item) => item.trim())
        : [];
    const preferIngredients = prefer
        ? prefer.split(",").map((item) => item.trim())
        : [];
    const dislikeIngredients = dislike
        ? dislike.split(",").map((item) => item.trim())
        : [];

    // 가지고 있는 재료가 없는 경우 (왜 요청해...?)
    if (haveIngredients.length < 1) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    // 재료 query string
    const haveWeight = 1;
    const preferWeight = 0.3;
    const dislikeWeight = -0.5;
    let ingredientsQueryString = "";

    if (haveIngredients.length > 0) {
        for (let i = 0; i < haveIngredients.length; i++) {
            if (i > 0) {
                ingredientsQueryString += " + ";
            }
            ingredientsQueryString += `(ingredients LIKE '%${haveIngredients[i]}%') * ${haveWeight}`;
        }
    }
    if (preferIngredients.length > 0) {
        for (let i = 0; i < preferIngredients.length; i++) {
            ingredientsQueryString += ` + (ingredients LIKE '%${preferIngredients[i]}%') * ${preferWeight}`;
        }
    }
    if (dislikeIngredients.length > 0) {
        for (let i = 0; i < dislikeIngredients.length; i++) {
            ingredientsQueryString += ` + (ingredients LIKE '%${dislikeIngredients[i]}%') * ${dislikeWeight}`;
        }
    }
    console.log(ingredientsQueryString);

    // 요리 인원수 : 1인분, 2인분, 3인분, 4인분, 5인분, 6인분이상
    // 요리 시간 : 5분이내, 10분이내, 15분이내, 20분이내, 30분이내, 60분이내, 90분이내, 2시간이내, 2시간이상
    // 난이도 : 아무나, 초급, 중급, 고급, 신의경지

    // 추가 정보
    const updates = [];
    const params = [];

    if (amount !== null && amount !== undefined) {
        updates.push("recipe_amount = ?");
        params.push(amount);
    }
    if (time !== null && time !== undefined) {
        updates.push("recipe_time = ?");
        params.push(time);
    }
    if (difficult !== null && difficult !== undefined) {
        updates.push("recipe_difficult = ?");
        params.push(difficult);
    }

    // query
    const query = `
        SELECT 
            recipe_name, 
            cooking_method,
            meal_category,
            ingredient_category,
            dish_type,
            instructions,
            ingredients,
            description,
            photo_url,
            recipe_amount,
            recipe_time,
            recipe_difficult,
            (
                ${ingredientsQueryString}
            ) AS score
        FROM 
            RECIPE_TB
        WHERE 
            approved = TRUE ${updates.join("AND ")}
        ORDER BY 
            score DESC
        LIMIT ${count};`;

    db.execute(query, params, (err, rows) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        return res.success({
            count: rows.length,
            recipes: rows,
        });
    });
});

// 레시피 추천 (비회원)
router.get("/recommend", (req, res, next) => {
    const { have } = req.query;

    // 재료를 ,를 기준으로 분리 (공백 제거)
    const haveIngredients = have
        ? have.split(",").map((item) => item.trim())
        : [];

    // 가지고 있는 재료가 없는 경우 (왜 요청해...?)
    if (haveIngredients.length < 1) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    // 재료 query string
    const haveWeight = 1;
    let ingredientsQueryString = "";

    if (haveIngredients.length > 0) {
        for (let i = 0; i < haveIngredients.length; i++) {
            if (i > 0) {
                ingredientsQueryString += " + ";
            }
            ingredientsQueryString += `(ingredients LIKE '%${haveIngredients[i]}%') * ${haveWeight}`;
        }
    }
    // console.log(ingredientsQueryString);

    // query
    const query = `
        SELECT 
            recipe_name, 
            cooking_method,
            meal_category,
            ingredient_category,
            dish_type,
            instructions,
            ingredients,
            description,
            photo_url,
            recipe_amount,
            recipe_time,
            recipe_difficult,
            (
                ${ingredientsQueryString}
            ) AS score
        FROM 
            RECIPE_TB
        WHERE 
            approved = TRUE
        ORDER BY 
            score DESC
        LIMIT 10;`;

    // console.log(query);

    db.execute(query, [], (err, rows) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        return res.success({
            count: rows.length,
            recipes: rows,
        });
    });
});

// TODO :
// 레시피 등록
// 레시피 승인

router.post("/", (req, res, next) => {
    // post
});

router.post("/approval", (req, res, next) => {
    //
});

module.exports = router;
