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
                DATE_FORMAT(record_time, ?) AS period
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
                        average_calories_per_entry:
                            row.average_calories_per_entry,
                        days: days,
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

// 혈당 차트 (일/주/월)
router.get("/blood-sugar", authenticateToken, (req, res, next) => {
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
                SUM(blood_sugar) AS total_blood_sugar,
                AVG(blood_sugar) AS average_blood_sugar_per_entry,
                DATE_FORMAT(record_time, ?) AS period
            FROM BLOOD_SUGAR_LOG_TB 
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
                        total_blood_sugar: row.total_blood_sugar,
                        average_blood_sugar_per_day:
                            row.total_blood_sugar / days,
                        average_blood_sugar_per_entry:
                            row.average_blood_sugar_per_entry,
                        days: days,
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

// 체중 일/주/월 차트
router.get("/weight", authenticateToken, (req, res, next) => {
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
                SUM(weight) AS total_weight,
                AVG(weight) AS average_weight_per_entry,
                DATE_FORMAT(record_time, ?) AS period
            FROM WEIGHT_LOG_TB
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
                        total_weight: row.total_weight,
                        average_weight_per_day: row.total_weight / days,
                        average_weight_per_entry: row.average_weight_per_entry,
                        days: days,
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

// 혈압 일/주/월 차트
router.get("/blood-pressure", authenticateToken, (req, res, next) => {
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
                SUM(blood_pressure_min) AS total_blood_pressure_min,
                AVG(blood_pressure_min) AS average_blood_pressure_min_per_entry,
                SUM(blood_pressure_max) AS total_blood_pressure_max,
                AVG(blood_pressure_max) AS average_blood_pressure_max_per_entry,
                DATE_FORMAT(record_time, ?) AS period
            FROM BLOOD_PRESSURE_LOG_TB
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
                        total_blood_pressure_min: row.total_blood_pressure_min,
                        average_blood_pressure_min_per_day:
                            row.total_blood_pressure_min / days,
                        average_blood_pressure_min_per_entry:
                            row.average_blood_pressure_min_per_entry,
                        total_blood_pressure_max: row.total_blood_pressure_max,
                        average_blood_pressure_max_per_day:
                            row.total_blood_pressure_max / days,
                        average_blood_pressure_max_per_entry:
                            row.average_blood_pressure_max_per_entry,
                        days: days,
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

// 식사 섭취 칼로리 일/주/월 차트
router.get("/meal", authenticateToken, (req, res, next) => {
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
                SUM(calories) AS total_calories,
                AVG(calories) AS average_calories_per_entry,
                DATE_FORMAT(record_date, ?) AS period
            FROM MEAL_LOG_TB
            WHERE record_date BETWEEN ? AND ?
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
                        average_calories_per_entry:
                            row.average_calories_per_entry,
                        days: days,
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

module.exports = router;
