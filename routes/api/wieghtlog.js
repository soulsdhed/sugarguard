const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");

// 체중 기록 조회
router.get("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { wl_id, startDate, endDate } = req.query;

    // id가 넘어오면 해당 id만
    if (wl_id) {
        const query = `SELECT 
                wl_id, 
                member_id, 
                record_time, 
                weight, 
                comments
            FROM WEIGHT_LOG_TB
            WHERE wl_id = ? AND member_id = ?`;
        db.execute(query, [wl_id, userId], (err, rows) => {
            if (err) {
                return next({
                    code: "SERVER_INTERNAL_ERROR",
                });
            }

            return res.success({
                count: rows.length,
                weight_logs: rows,
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
                wl_id, 
                member_id, 
                record_time, 
                weight, 
                comments
            FROM WEIGHT_LOG_TB
            WHERE record_time BETWEEN ? AND ? AND member_id = ?`;
        db.execute(query, [startDateTime, endDateTime, userId], (err, rows) => {
            if (err) {
                return next({
                    code: "SERVER_INTERNAL_ERROR",
                });
            }

            return res.success({
                userId: userId,
                count: rows.length,
                weight_logs: rows,
            });
        });
    }
});

// 체중 기록 등록
router.post("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { record_time, weight, comments } = req.body;

    // 유효성 검사 (체중이 없으면 안된다)
    if (weight === null || weight === undefined) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    // query문 작성 준비
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
    if (weight !== null && weight !== undefined) {
        creates.push("weight");
        params.push(weight);
        data["weight"] = weight;
    }
    if (comments !== null && comments !== undefined) {
        creates.push("comments");
        params.push(comments);
        data["comments"] = comments;
    }

    const query = `INSERT INTO WEIGHT_LOG_TB
                (${creates.join(", ")})
            VALUES (${creates.fill("?").join(", ")});`;
    db.execute(query, params, (err, results) => {
        // sql error 또는 등록되지 않은 경우
        if (err || results.affectedRows < 1) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }
        // 등록 성공
        return res.success({ data });
    });
});

// 체중 기록 수정
router.patch("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { wl_id, record_time, weight, comments } = req.body;

    // 유효성 검사
    if (!wl_id) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
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
    if (weight !== null && weight !== undefined) {
        updates.push("weight = ?");
        params.push(weight);
        data["weight"] = weight;
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

    params.push(wl_id);
    params.push(userId);
    const query = `UPDATE WEIGHT_LOG_TB
        SET ${updates.join(", ")}
        WHERE wl_id = ? AND member_id = ?`;

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
