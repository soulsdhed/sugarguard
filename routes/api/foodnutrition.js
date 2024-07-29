const express = require("express");
const router = express.Router();
const db = require("../../conf/db");

// 식품 영양정보 받아오기
router.get("/", (req, res, next) => {
    const { foodName } = req.query;

    // const query = `
    //     SELECT *
    //     FROM FOOD_NUTRITION_TB
    //     WHERE food_name LIKE ?
    //     ORDER BY food_nutrition_id ASC
    //     LIMIT 10;
    // `;
    const query = `
        SELECT *
        FROM FOOD_NUTRITION_TB
        WHERE food_name LIKE ?
        ORDER BY
            CASE
                WHEN LOCATE(?, food_name) = 1 THEN 1
                WHEN LOCATE(?, food_name) = 2 THEN 2
                ELSE 3
            END,
            food_nutrition_id ASC
        LIMIT 10;
    `;
    db.execute(query, [`%${foodName}%`, foodName, foodName], (err, rows) => {
        if (err) {
            next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }
        // console.log(rows);

        return res.success({
            count: rows.length,
            data: rows,
        });
    });
});

module.exports = router;
