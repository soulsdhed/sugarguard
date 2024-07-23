const express = require("express");
const router = express.Router();
const db = require("../../conf/db");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");

// jwt
const {
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    generateAccessToken,
    generateRefreshToken,
} = require("../../utils/jwt");
const authenticateToken = require("../../middlewares/authenticateToken");

// 회원 가입
router.post("/", async (req, res, next) => {
    const {
        userId,
        password,
        nickname,
        email,
        gender,
        birthDate,
        diabetesType,
    } = req.body;

    // 빈 필드 검사 (필수 항목 검사)
    if (!userId || !password || !nickname || !email || !gender) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    // ID 유효성 검사 (영어와 숫자로만, 4~12글자)
    if (userId.length < 4 || userId.length > 12) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 비밀번호 유효성 검사 (8이상, 16자 이하)
    if (password.length < 8 || password.length > 16) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 닉네임 유효성 검사 (4~20글자)
    if (nickname.length < 4 || nickname.length > 20) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 이메일 유효성 검사 (이메일 형식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 성별 유효성 검사 (남성, 여성)
    if (!["남성", "여성"].includes(gender)) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 날짜 유효성 검사 (형식 검사)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // CHECK : 당뇨 타입 유효성 검사
    // if (diabetes_type === undefined) diabetes_type = null; // const라서 아래 처리

    try {
        // password 암호화
        const cryptedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO MEMBER_TB (
                member_id, 
                password, 
                nickname, 
                email, 
                gender, 
                birth_date, 
                diabetes_type)
            VALUES (?, ?, ?, ?, ?, ?, ?);`;
        db.execute(
            query,
            [
                userId,
                cryptedPassword,
                nickname,
                email,
                gender,
                birthDate,
                diabetesType || null,
            ],
            (err, results) => {
                // sql error 또는 등록되지 않은 경우
                if (err || results.affectedRows < 1) {
                    return next({
                        code: "SERVER_INTERNAL_ERROR",
                    });
                }

                // register success
                return res.success({
                    userId: userId,
                    nickname: nickname,
                    email: email,
                    gender: gender,
                    birthDate: birthDate,
                    diabetesType: diabetesType,
                    createdAt: new Date(),
                });
            }
        );
    } catch (e) {
        next({
            code: "SERVER_INTERNAL_ERROR",
        });
    }
});

// 로그인
router.post("/login", (req, res, next) => {
    const { userId, password } = req.body;

    // query
    const query = `SELECT member_id, password, nickname, email, gender, birth_date, diabetes_type, deleted_at
        FROM MEMBER_TB 
        WHERE member_id = ?`;

    db.execute(query, [userId], async (err, results) => {
        // sql error
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 유저가 1개가 아닌경우 (가능하냐?)
        if (results.length != 1) {
            return next({
                code: "USER_NOT_FOUND",
            });
        }

        // select success
        const row = results[0];

        // 비밀번호 확인
        try {
            const compare = await bcrypt.compare(password, row.password);
            // log(compare);

            // 비밀번호 틀림
            if (!compare) {
                return next({
                    code: "INVALID_USER",
                });
            }

            // 삭제된 유저의 경우
            if (row.deleted_at != null) {
                return next({
                    code: "USER_NOT_FOUND",
                });
            }

            // 비밀번호 확인 성공
            // jwt 발급
            const user = {
                userId: row.member_id,
            };
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            // refresh token table에 저장
            const refreshTokenInsertQuery = `INSERT INTO REFRESH_TOKEN_TB 
                (refresh_token, member_id, expires_at) 
                VALUES (?, ?, ?)`;
            db.execute(
                refreshTokenInsertQuery,
                [
                    refreshToken,
                    userId,
                    new Date(Date.now() + refreshTokenExpiresIn * 1000), // 7일
                ],
                (err, results) => {
                    // sql error
                    if (err || results.affectedRows <= 0) {
                        return next({
                            code: "SERVER_INTERNAL_ERROR",
                        });
                    }

                    // 리프레쉬 토큰 추가 성공
                    // 쿠키에 저장
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        maxAge: accessTokenExpiresIn * 1000,
                    });
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        maxAge: refreshTokenExpiresIn * 1000,
                    });

                    // client에 응답 (login success)
                    return res.success({
                        userId: row.userId,
                        nickname: row.nickname,
                        email: row.email,
                        gender: row.gender,
                        birthDate: moment
                            .utc(row.birth_date)
                            .tz("Asia/Seoul")
                            .format("YYYY-MM-DD"),
                        diabetes_type: row.diabetes_type,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                }
            );
        } catch (e) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }
    });
});

// 회원 탈퇴 (jwt)
router.delete("/", authenticateToken, (req, res, next) => {
    const { userId, password } = req.body;

    // 비밀번호 확인
    const query = `SELECT member_id, password, nickname, email, gender, birth_date, diabetes_type, deleted_at
        FROM MEMBER_TB 
        WHERE member_id = ?`;
    db.execute(query, [userId], async (err, results) => {
        // sql error
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 유저가 1개가 아닌경우 (가능하냐?)
        if (results.length != 1) {
            return next({
                code: "USER_NOT_FOUND",
            });
        }

        // select success
        const row = results[0];

        // 비밀번호 확인
        try {
            const compare = await bcrypt.compare(password, row.password);

            // 비밀번호 틀림
            if (!compare) {
                return next({
                    code: "INVALID_USER",
                });
            }

            // 삭제된 유저의 경우
            if (row.deleted_at != null) {
                return next({
                    code: "USER_NOT_FOUND",
                });
            }

            // success
            // 계정 삭제 작업
            const currentTime = new Date();
            const query = `UPDATE MEMBER_TB SET deleted_at = ? WHERE member_id = ?;`;
            db.execute(query, [currentTime, userId], (err, results) => {
                if (err) {
                    return next({
                        code: "SERVER_INTERNAL_ERROR",
                    });
                }

                // 영향받은 rows가 존재하지 않는 경우 (그럴 수 있나??)
                if (results.affectedRows <= 0) {
                    return next({
                        code: "SERVER_INTERNAL_ERROR",
                    });
                }

                // user delete success!!
                return res.success({
                    userId: userId,
                    deletedAt: currentTime,
                });
            });
        } catch (e) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }
    });
});

// 회원 정보 수정 (jwt)
router.patch("/", authenticateToken, (req, res, next) => {
    const { userId, nickname, email, gender, birthDate, diabetesType } =
        req.body;

    // userId는 반드시 있어야 한다
    if (!userId) {
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

    if (nickname !== null && nickname !== undefined) {
        updates.push("nickname = ?");
        params.push(nickname);
        data["nickname"] = nickname;
    }
    if (email !== null && email !== undefined) {
        updates.push("email = ?");
        params.push(email);
        data["email"] = email;
    }
    if (gender !== null && gender !== undefined) {
        updates.push("gender = ?");
        params.push(gender);
        data["gender"] = gender;
    }
    if (birthDate !== null && birthDate !== undefined) {
        updates.push("birthDate = ?");
        params.push(birthDate);
        data["birthDate"] = birthDate;
    }
    if (diabetesType !== null && diabetesType !== undefined) {
        updates.push("diabetesType = ?");
        params.push(diabetesType);
        data["diabetesType"] = diabetesType;
    }

    // 수정 사항이 1개도 없는 경우 (없으면 대체 왜 이걸 call하냐...)
    if (updates.length < 1) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    params.push(userId);
    const query = `UPDATE MEMBER_TB
        SET ${updates.join(", ")}
        WHERE member_id = ?`;
    db.execute(query, params, (err, results) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 존재하지 않는 유저
        if (results.affectedRows < 1) {
            return next({
                code: "USER_NOT_FOUND",
            });
        }

        // 정상 업데이트
        return res.success({ data });
    });
});

// 로그 아웃 (jwt)
router.post("/logout", authenticateToken, (req, res, next) => {
    const { userId } = req.body;

    // 유저의 모든 refreshToken 삭제
    const query = `DELETE FROM REFRESH_TOKEN_TB WHERE member_id = ?`;
    db.execute(query, [userId], (err, results) => {
        if (err) {
            console.log(err);
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // token 쿠키 삭제
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.success({
            userId: userId,
        });
    });
});

// id 중복검사
router.get("/exists/userid", (req, res, next) => {
    const userId = req.query.userId;

    // id가 없으면 왜...
    if (!userId) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    const query = `SELECT COUNT(*) as count FROM MEMBER_TB WHERE member_id = ?`;
    db.execute(query, [userId], (err, rows) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 해당 id의 유저가 있는 경우
        if (rows[0].count > 0) {
            return res.success({
                userId: userId,
                exists: true,
            });
        }

        // 해당 id의 유저가 없는 경우
        return res.success({
            userId: userId,
            exists: false,
        });
    });
});

// email 중복검사
router.get("/exists/email", (req, res, next) => {
    const email = req.query.email;

    // id가 없으면 왜...
    if (!email) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    const query = `SELECT COUNT(*) as count FROM MEMBER_TB WHERE email = ?`;
    db.execute(query, [email], (err, rows) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 해당 email의 유저가 있는 경우
        if (rows[0].count > 0) {
            return res.success({
                email: email,
                exists: true,
            });
        }

        // 해당 email의 유저가 없는 경우
        return res.success({
            email: email,
            exists: false,
        });
    });
});

// TODO : 천천히 하자.... 메일 보내고 생지랄 해야하자너
// 비밀 번호 찾기 (jwt)

module.exports = router;
