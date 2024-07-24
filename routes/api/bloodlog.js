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
                record_type,
                blood_sugar, 
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
        // startDate가 endDate보다 더 뒤인 경우
        if (new Date(startDate) > new Date(endDate)) {
            return next({
                code: "VALIDATION_ERROR",
            });
        }

        const startDateTime = `${startDate} 00:00:00`;
        const endDateTime = `${endDate} 23:59:59`;

        const query = `SELECT
                bsl_id, 
                member_id, 
                record_time, 
                record_type,
                blood_sugar, 
                comments
            FROM BLOOD_SUGAR_LOG_TB
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
                blood_sugar_logs: rows,
            });
        });
    }
});

// 혈당 기록 등록
router.post("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { record_time, record_type, blood_sugar, comments } = req.body;

    // 유효성 검사 (혈당값이 없으면 안된다)
    if (blood_sugar === null || blood_sugar === undefined) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    // record_type enum 검사
    if (
        ![
            "공복",
            "아침 식전",
            "아침 식후",
            "점심 식전",
            "점심 식후",
            "저녁 식전",
            "저녁 식후",
            "취침 전",
            "실시간",
        ].includes(record_type)
    ) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // query문 작성 준비 및 유효성 검사
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
    if (record_type !== null && record_type !== undefined) {
        creates.push("record_type");
        params.push(record_type);
        data["record_type"] = record_type;
    }
    if (blood_sugar !== null && blood_sugar !== undefined) {
        creates.push("blood_sugar");
        params.push(blood_sugar);
        data["blood_sugar"] = blood_sugar;
    }
    if (comments !== null && comments !== undefined) {
        creates.push("comments");
        params.push(comments);
        data["comments"] = comments;
    }

    // record_type이 '공복', '실시간'이 아닌 경우,
    // 동일 날짜에 기록이 있는지 확인 후에 기록이 있으면 처리
    if (!["공복", "실시간"].includes(record_type)) {
        const query = `
            SELECT COUNT(*) AS count
            FROM BLOOD_SUGAR_LOG_TB
            WHERE member_id = ?
                AND DATE(record_time) = DATE(?)
                AND record_type = ?`;
        db.execute(
            query,
            [userId, record_time || new Date(), record_type],
            (err, rows) => {
                console.log("???");
                if (err) {
                    return next({
                        code: "SERVER_INTERNAL_ERROR",
                    });
                }

                // 이미 기록이 있는 경우
                if (rows[0].count > 0) {
                    return next({
                        code: "VALIDATION_ERROR",
                    });
                }

                // 기록이 없는 경우 (기록)
                const query = `INSERT INTO BLOOD_SUGAR_LOG_TB
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
            }
        );
    } else {
        // 그냥 기록
        const query = `INSERT INTO BLOOD_SUGAR_LOG_TB
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
    }
});

// 혈당 기록 수정
router.patch("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    const { bsl_id, record_time, record_type, blood_sugar, comments } =
        req.body;

    // 유효성 검사
    if (!bsl_id) {
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
    if (record_type !== null && record_type !== undefined) {
        updates.push("record_type = ?");
        params.push(record_type);
        data["record_type"] = record_type;
    }
    if (blood_sugar !== null && blood_sugar !== undefined) {
        updates.push("blood_sugar = ?");
        params.push(blood_sugar);
        data["blood_sugar"] = blood_sugar;
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
