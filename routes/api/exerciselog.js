const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");

// 운동 기록 조회
router.get("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { el_id, startDate, endDate } = req.query;

    // id가 넘어오면 해당 id만
    if (el_id) {
        const query = `SELECT 
                    el_id, 
                    member_id, 
                    record_time,
                    exercise_type, 
                    exercise_time, 
                    calories_burned, 
                    comments
                FROM EXERCISE_LOG_TB
                WHERE el_id = ? AND member_id = ?`;
        db.execute(query, [el_id, userId], (err, rows) => {
            if (err) {
                return next({
                    code: "SERVER_INTERNAL_ERROR",
                });
            }

            return res.success({
                count: rows.length,
                exercise_logs: rows,
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
                    el_id, 
                    member_id, 
                    record_time,
                    exercise_type, 
                    exercise_time, 
                    calories_burned , 
                    comments
                FROM EXERCISE_LOG_TB
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
                exercise_logs: rows,
            });
        });
    }
});

// 운동 기록 등록
router.post("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const {
        record_time,
        exercise_type,
        exercise_time,
        calories_burned,
        comments,
    } = req.body;

    if (!userId || !exercise_type || !exercise_time) {
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
    if (exercise_type !== null && exercise_type !== undefined) {
        creates.push("exercise_type");
        params.push(exercise_type);
        data["exercise_type"] = exercise_type;
    }
    if (exercise_time !== null && exercise_time !== undefined) {
        creates.push("exercise_time");
        params.push(exercise_time);
        data["exercise_time"] = exercise_time;
    }
    if (calories_burned !== null && calories_burned !== undefined) {
        creates.push("calories_burned");
        params.push(calories_burned);
        data["calories_burned"] = calories_burned;
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

    const query = `INSERT INTO EXERCISE_LOG_TB
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

// 운동 기록 수정
router.patch("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const {
        el_id,
        record_time,
        exercise_type,
        exercise_time,
        calories_burned,
        comments,
    } = req.body;

    if (!userId) {
        return next({
            code: "USER_NOT_FOUND",
        });
    }

    if (!el_id) {
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
    if (exercise_type !== null && exercise_type !== undefined) {
        updates.push("exercise_type = ?");
        params.push(exercise_type);
        data["exercise_type"] = exercise_type;
    }
    if (exercise_time !== null && exercise_time !== undefined) {
        updates.push("exercise_time = ?");
        params.push(exercise_time);
        data["exercise_time"] = exercise_time;
    }
    if (calories_burned !== null && calories_burned !== undefined) {
        updates.push("calories_burned = ?");
        params.push(calories_burned);
        data["calories_burned"] = calories_burned;
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

    params.push(el_id);
    params.push(userId);
    const query = `UPDATE EXERCISE_LOG_TB
        SET ${updates.join(", ")}
        WHERE el_id = ? AND member_id = ?`;

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
