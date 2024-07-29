const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");

// 식사 기록 조회
router.get("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { ml_id, startDate, endDate } = req.query;

    // id가 넘어오면 해당 id만
    if (ml_id) {
        const query = `SELECT 
                    ml_id, 
                    member_id, 
                    record_date,
                    meal_time, 
                    medication,
                    meal_info,
                    calories,
                    comments
                FROM MEAL_LOG_TB
                WHERE ml_id = ? AND member_id = ?`;
        db.execute(query, [ml_id, userId], (err, rows) => {
            if (err) {
                console.log(err);
                return next({
                    code: "SERVER_INTERNAL_ERROR",
                });
            }

            return res.success({
                count: rows.length,
                meal_logs: rows,
            });
        });
    } else {
        // 기간이 넘어오면 해당 기간 전부
        // 기간이 없는 경우
        if (!startDate || !endDate) {
            return next({
                code: "VALIDATION_MISSING_FIELD",
            });
        }
        // startDate가 endDate보다 더 뒤인 경우
        if (new Date(startDate) > new Date(endDate)) {
            return next({
                code: "VALIDATION_ERROR",
            });
        }

        const startDateTime = `${startDate} 00:00:00`;
        const endDateTime = `${endDate} 23:59:59`;

        const query = `SELECT
                    ml_id, 
                    member_id, 
                    record_date,
                    meal_time, 
                    medication,
                    meal_info,
                    calories,
                    comments
                FROM MEAL_LOG_TB
                WHERE record_date BETWEEN ? AND ? AND member_id = ?`;
        db.execute(query, [startDateTime, endDateTime, userId], (err, rows) => {
            if (err) {
                console.log(err);
                return next({
                    code: "SERVER_INTERNAL_ERROR",
                });
            }

            return res.success({
                userId: userId,
                count: rows.length,
                meal_logs: rows,
            });
        });
    }
});

// 식사 기록 등록
router.post("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const {
        record_date = new Date(new Date().setHours(0, 0, 0, 0)),
        meal_time,
        medication,
        meal_info,
        calories,
        comments,
    } = req.body;

    // TODO : 식사 사진 받도록 (DB도 수정)

    if (!userId || !meal_time) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    const creates = ["member_id"];
    const params = [userId];
    const data = {
        userId: userId,
    };
    if (record_date !== null && record_date !== undefined) {
        creates.push("record_date");
        params.push(record_date);
        data["record_date"] = record_date;
    }
    if (meal_time !== null && meal_time !== undefined) {
        creates.push("meal_time");
        params.push(meal_time);
        data["meal_time"] = meal_time;
    }
    if (medication !== null && medication !== undefined) {
        creates.push("medication");
        params.push(medication);
        data["medication"] = medication;
    }
    if (meal_info !== null && meal_info !== undefined) {
        creates.push("meal_info");
        params.push(meal_info);
        data["meal_info"] = meal_info;
    }
    if (calories !== null && calories !== undefined) {
        creates.push("calories");
        params.push(calories);
        data["meal_info"] = calories;
    }
    if (comments !== null && comments !== undefined) {
        creates.push("comments");
        params.push(comments);
        data["comments"] = comments;
    }

    // 기록이 내용이 1개도 없는 경우 (없는데 왜...)
    if (creates.length < 1) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    const query = `INSERT INTO MEAL_LOG_TB
            (${creates.join(", ")})
        VALUES (${creates.fill("?").join(", ")});`;
    db.execute(query, params, (err, results) => {
        // sql error 또는 등록되지 않은 경우
        if (err || results.affectedRows < 1) {
            console.log(err);
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 등록 성공
        return res.success({ data });
    });
});

// 식사 기록 수정
router.patch("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const {
        ml_id,
        record_date,
        meal_time,
        medication,
        meal_info,
        calories,
        comments,
    } = req.body;

    if (!userId) {
        return next({
            code: "USER_NOT_FOUND",
        });
    }

    if (!ml_id) {
        return next({
            code: "DATA_NOT_FOUND",
        });
    }

    // 업데이트할 필드 동적 생성
    const updates = [];
    const params = [];
    const data = {
        userId: userId,
    };
    if (record_date !== null && record_date !== undefined) {
        updates.push("record_date = ?");
        params.push(record_date);
        data["record_date"] = record_date;
    }
    if (meal_time !== null && meal_time !== undefined) {
        updates.push("meal_time = ?");
        params.push(meal_time);
        data["meal_time"] = meal_time;
    }
    if (medication !== null && medication !== undefined) {
        updates.push("medication = ?");
        params.push(medication);
        data["medication"] = medication;
    }
    if (meal_info !== null && meal_info !== undefined) {
        updates.push("meal_info = ?");
        params.push(meal_info);
        data["meal_info"] = meal_info;
    }
    if (calories !== null && calories !== undefined) {
        updates.push("calories = ?");
        params.push(calories);
        data["calories"] = calories;
    }
    if (comments !== null && comments !== undefined) {
        updates.push("comments = ?");
        params.push(comments);
        data["comments"] = comments;
    }

    // 수정 사항이 1개도 없는 경우 (없으면 대체 왜 이걸 call하냐...)
    if (updates.length < 1) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    params.push(ml_id);
    params.push(userId);
    const query = `UPDATE MEAL_LOG_TB
        SET ${updates.join(", ")}
        WHERE ml_id = ? AND member_id = ?`;

    db.execute(query, params, (err, results) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        if (results.affectedRows < 1) {
            return next({
                code: "DATA_NOT_FOUND",
            });
        }

        // 성공
        res.success({ data });
    });
});

// 가장 최근 기록 가져오기
router.get("/recent", authenticateToken, (req, res, next) => {
    const { userId } = req.user;

    const query = `SELECT
            ml_id,
            member_id,
            record_date,
            meal_time,
            medication,
            meal_info,
            calories,
            comments
        FROM MEAL_LOG_TB
        WHERE member_id = ?
        ORDER BY record_date DESC
        LIMIT 1;
    `;
    db.execute(query, [userId], (err, rows) => {
        if (err) {
            console.log(err);
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        return res.success({
            count: rows.length,
            meal_logs: rows,
        });
    });
});

module.exports = router;
