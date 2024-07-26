const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");
const {
    getWeekDateRange,
    getLastDateOfMonth,
    calculateDays,
} = require("../../utils/days");
const {
    isValidDate,
    isValidWeek,
    isValidMonth,
} = require("../../utils/validation");

// 운동 소모 칼로리 차트 (일/주/월)
router.get("/exercise", authenticateToken, (req, res, next) => {
    const { userId } = req.user;
    let {
        period,
        startDate,
        endDate,
        startWeek,
        endWeek,
        startMonth,
        endMonth,
    } = req.query;

    // period 유효성 검사
    if (!["DAY", "WEEK", "MONTH"].includes(period.toUpperCase())) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 각 period별로 query 유효성 검사
    if (period.toUpperCase() == "DAY") {
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return next({
                code: "VALIDATION_ERROR",
            });
        }
    } else if (period.toUpperCase() == "WEEK") {
        if (!isValidWeek(startWeek) || !isValidWeek(endWeek)) {
            return next({
                code: "VALIDATION_MISSING_FIELD",
            });
        }
        const date = getWeekDateRange(startWeek, endWeek);
        startDate = date.startDate;
        endDate = date.endDate;
    } else if (period.toUpperCase() == "MONTH") {
        if (!isValidMonth(startMonth) || !isValidMonth(endMonth)) {
            return next({
                code: "VALIDATION_MISSING_FIELD",
            });
        }
        startDate = startMonth + "-01";
        endDate = getLastDateOfMonth(endMonth);
    }

    // startDate가 endDate보다 더 뒤인 경우
    if (new Date(startDate) > new Date(endDate)) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    const startDateTime = `${startDate} 00:00:00`;
    const endDateTime = `${endDate} 23:59:59`;

    let dateFormat = "";
    if (period.toUpperCase() === "DAY") {
        dateFormat = "%Y-%m-%d";
    } else if (period.toUpperCase() === "WEEK") {
        dateFormat = "%Y-%u";
    } else if (period.toUpperCase() === "MONTH") {
        dateFormat = "%Y-%m";
    }

    try {
        const query = `
            SELECT 
                SUM(calories_burned) AS total_calories,
                AVG(calories_burned) AS average_calories_per_entry,
                DATE_FORMAT(record_time, ?) AS period,
                COUNT(DISTINCT DATE(record_time)) AS entry_count
            FROM EXERCISE_LOG_TB
            WHERE record_time BETWEEN ? AND ?
            GROUP BY period
            ORDER BY period
        `;
        db.execute(
            query,
            [dateFormat, startDateTime, endDateTime],
            (err, rows) => {
                if (err) {
                    return next({
                        code: "SERVER_INTERNAL_ERROR",
                    });
                }

                // 결과값 생성
                const results = rows.map((row) => {
                    const days = calculateDays(period, row.period);
                    return {
                        period: row.period,
                        total_calories: row.total_calories,
                        average_calories_per_day: row.total_calories / days,
                        days: days,
                        average_calories_per_entry:
                            row.average_calories_per_entry,
                        entry_count: row.entry_count,
                    };
                });

                return res.success({
                    userId: userId,
                    count: rows.length,
                    chartData: results,
                });
            }
        );
    } catch (e) {
        return next({
            code: "SERVER_INTERNAL_ERROR",
        });
    }
});

// TODO :

module.exports = router;
