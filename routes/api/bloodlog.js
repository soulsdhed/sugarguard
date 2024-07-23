const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");

// 혈당 기록 조회 (기간별, id별)
router.get("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { bsl_id, startDate, endDate } = req.query;

    // id가 넘어오면 해당 id만
    if (bsl_id) {
        const query = `SELECT 
                bsl_id, 
                member_id, 
                record_time, 
                blood_sugar, 
                weight, 
                blood_pressure_min, 
                blood_pressure_max, 
                comments
            FROM BLOOD_SUGAR_LOG_TB
            WHERE bsl_id = ? AND member_id = ?`;
        db.execute(query, [bsl_id, userId], (err, rows) => {
            if (err) {
                return next({
                    code: "SERVER_INTERNAL_ERROR",
                });
            }

            return res.success({
                count: rows.length,
                blood_sugar_logs: rows,
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
        const startDateTime = `${startDate} 00:00:00`;
        const endDateTime = `${endDate} 23:59:59`;

        const query = `SELECT
                bsl_id, 
                member_id, 
                record_time, 
                blood_sugar, 
                weight, 
                blood_pressure_min, 
                blood_pressure_max, 
                comments
            FROM BLOOD_SUGAR_LOG_TB
            WHERE record_time BETWEEN ? AND ? AND member_id = ?`;
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
                blood_sugar_logs: rows,
            });
        });
    }
});

// 혈당 기록 등록
router.post("/", authenticateToken, (req, res, next) => {
    const {
        userId,
        record_time,
        blood_sugar,
        weight,
        blood_pressure_min,
        blood_pressure_max,
        comments,
    } = req.body;

    if (!userId) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    const creates = ["member_id"];
    const params = [userId];
    const data = {
        userId: userId,
    };
    if (record_time !== null && record_time !== undefined) {
        creates.push("record_time");
        params.push(record_time);
        data["record_time"] = record_time;
    }
    if (blood_sugar !== null && blood_sugar !== undefined) {
        creates.push("blood_sugar");
        params.push(blood_sugar);
        data["blood_sugar"] = blood_sugar;
    }
    if (weight !== null && weight !== undefined) {
        creates.push("weight");
        params.push(weight);
        data["weight"] = weight;
    }
    if (blood_pressure_min !== null && blood_pressure_min !== undefined) {
        creates.push("blood_pressure_min");
        params.push(blood_pressure_min);
    }
    if (blood_pressure_max !== null && blood_pressure_max !== undefined) {
        creates.push("blood_pressure_max");
        params.push(blood_pressure_max);
    }
    if (comments !== null && comments !== undefined) {
        creates.push("comments");
        params.push(comments);
    }

    // 기록이 내용이 1개도 없는 경우 (없는데 왜...)
    if (creates.length < 1) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    const query = `INSERT INTO BLOOD_SUGAR_LOG_TB
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

// 혈당 기록 수정
router.patch("/", authenticateToken, (req, res, next) => {
    const {
        bsl_id,
        userId,
        record_time,
        blood_sugar,
        weight,
        blood_pressure_min,
        blood_pressure_max,
        comments,
    } = req.body;

    if (!userId) {
        return next({
            code: "USER_NOT_FOUND",
        });
    }

    if (!bsl_id) {
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
    if (record_time !== null && record_time !== undefined) {
        updates.push("record_time = ?");
        params.push(record_time);
        data["record_time"] = record_time;
    }
    if (blood_sugar !== null && blood_sugar !== undefined) {
        updates.push("blood_sugar = ?");
        params.push(blood_sugar);
        data["blood_sugar"] = blood_sugar;
    }
    if (weight !== null && weight !== undefined) {
        updates.push("weight = ?");
        params.push(weight);
        data["weight"] = weight;
    }
    if (blood_pressure_min !== null && blood_pressure_min !== undefined) {
        updates.push("blood_pressure_min = ?");
        params.push(blood_pressure_min);
        data["blood_pressure_min"] = blood_pressure_min;
    }
    if (blood_pressure_max !== null && blood_pressure_max !== undefined) {
        updates.push("blood_pressure_max = ?");
        params.push(blood_pressure_max);
        data["blood_pressure_max"] = blood_pressure_max;
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

    params.push(bsl_id);
    params.push(userId);
    const query = `UPDATE BLOOD_SUGAR_LOG_TB
        SET ${updates.join(", ")}
        WHERE bsl_id = ? AND member_id = ?`;

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

module.exports = router;
