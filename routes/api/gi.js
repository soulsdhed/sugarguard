const express = require("express");
const router = express.Router();
const db = require("../../conf/db");

// 당뇨 지수 검색
router.get("/", (req, res, next) => {
    const { foodName } = req.query;

    const foodNames = foodName
        .split(" ")
        .map((term) => `+${term}*`)
        .join(" ");
    const query = `
        SELECT food_name, glycemic_index, glycemic_load
            FROM GLYCEMIC_INDEX_TB
            WHERE MATCH (food_name) AGAINST (? IN BOOLEAN MODE)
    `;
    db.execute(query, [foodNames], (err, rows) => {
        if (err) {
            console.log(err);
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        return res.success({
            count: rows.length,
            gi_data: rows,
        });
    });
});

module.exports = router;
