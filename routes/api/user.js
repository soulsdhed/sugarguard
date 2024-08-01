const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");

const db = require("../../conf/db");
const { sendResetEmail } = require("../../conf/mailer");

// jwt
const {
    refreshTokenExpiresIn,
    resetPasswordTokenExpiredIn,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} = require("../../utils/jwt");
const authenticateToken = require("../../middlewares/authenticateToken");

// redis
const {
    setTemporaryValue,
    getValue,
    deleteValue,
} = require("../../utils/redisUtils");

// validation
const {
    isValidDate,
    isValidEmail,
    isValidPassword,
    isValidUserId,
    isValidNickname,
} = require("../../utils/validation");
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

    console.log(req.body);

    // TODO : 유효성 검사 전체적으로 다시 확인 (id, 영어만 가능하게)
    // ID 유효성 검사 (영어와 숫자로만, 4~12글자)
    // if (userId.length < 4 || userId.length > 12) {
    //     return next({
    //         code: "VALIDATION_ERROR",
    //     });
    // }
    if (!isValidUserId(userId)) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 비밀번호 유효성 검사 (8이상, 16자 이하)
    if (!isValidPassword(password)) {
        console.log("그놈의 페쓰워드오류 씨발@");
        return next({
            code: "VALIDATION_ERROR",
        });
    }
    // if (password.length < 8 || password.length > 16) {
    //     return next({
    //         code: "VALIDATION_ERROR",
    //     });
    // }

    // 닉네임 유효성 검사 (4~20글자)
    if (!isValidNickname(nickname)) {
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 이메일 유효성 검사 (이메일 형식)
    if (!isValidEmail(email)) {
        console.log("그놈의 이메일오류 씨발@");
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 성별 유효성 검사 (남성, 여성)
    if (!["남성", "여성"].includes(gender.toLowerCase())) {
        console.log("그놈의 젠더오류 씨발@");
        return next({
            code: "VALIDATION_ERROR",
        });
    }

    // 날짜 유효성 검사 (형식 검사)
    // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // if (!dateRegex.test(birthDate)) {
    //     return next({
    //         code: "VALIDATION_ERROR",
    //     });
    // }
    if (!isValidDate(birthDate)) {
        console.log("그놈의 생일오류 씨발@");
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
                    console.log(err);
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
    let whereQuery = "member_id";

    // userId가 이메일 형식으로 왔는지 확인 (이메일 형식이면 이메일 검사)
    if (isValidEmail(userId)) {
        whereQuery = "email";
    }

    // query
    const query = `
        SELECT 
            member_id, 
            password, 
            nickname, 
            email, 
            gender, 
            birth_date, 
            diabetes_type
        FROM MEMBER_TB 
        WHERE ${whereQuery} = ? AND deleted_at IS NULL
    `;
    db.execute(query, [userId], async (err, results) => {
        // sql error
        if (err) {
            console.log(err);
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
            const accessToken = generateAccessToken(res, row.member_id);
            const refreshToken = generateRefreshToken(res, row.member_id);

            // Redis에 Refresh Token 저장 (id값으로 refresh token을 저장, 7일간만)
            try {
                // redis에 id를 key로 refresh token을 저장
                await setTemporaryValue(
                    userId,
                    refreshToken,
                    refreshTokenExpiresIn
                );

                // 리프레쉬 토큰 추가 성공
                // client에 응답 (login success)
                return res.success({
                    userId: row.member_id,
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
            } catch (e) {
                console.log(e);
                return next({
                    code: "SERVER_SERVICE_UNAVAILABLE",
                });
            }

            // // refresh token table에 저장
            // const refreshTokenInsertQuery = `INSERT INTO REFRESH_TOKEN_TB
            //     (refresh_token, member_id, expires_at)
            //     VALUES (?, ?, ?)`;
            // db.execute(
            //     refreshTokenInsertQuery,
            //     [
            //         refreshToken,
            //         row.member_id,
            //         new Date(Date.now() + refreshTokenExpiresIn * 1000), // 7일
            //     ],
            //     (err, results) => {
            //         // sql error
            //         if (err || results.affectedRows <= 0) {
            //             return next({
            //                 code: "SERVER_INTERNAL_ERROR",
            //             });
            //         }

            //         // 리프레쉬 토큰 추가 성공
            //         // client에 응답 (login success)
            //         return res.success({
            //             userId: row.member_id,
            //             nickname: row.nickname,
            //             email: row.email,
            //             gender: row.gender,
            //             birthDate: moment
            //                 .utc(row.birth_date)
            //                 .tz("Asia/Seoul")
            //                 .format("YYYY-MM-DD"),
            //             diabetes_type: row.diabetes_type,
            //             accessToken: accessToken,
            //             refreshToken: refreshToken,
            //         });
            //     }
            // );
        } catch (e) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }
    });
});

// 회원 탈퇴 (jwt)
router.delete("/", authenticateToken, async (req, res, next) => {
    const { userId } = req.user;
    // const { password } = req.body;

    // 비밀번호 확인 후 삭제
    // // 비밀번호 확인
    // const query = `SELECT member_id, nickname, email, gender, birth_date, diabetes_type, deleted_at
    //     FROM MEMBER_TB
    //     WHERE member_id = ?`;
    // db.execute(query, [userId], async (err, results) => {
    //     // sql error
    //     if (err) {
    //         return next({
    //             code: "SERVER_INTERNAL_ERROR",
    //         });
    //     }

    //     // 유저가 1개가 아닌경우 (가능하냐?)
    //     if (results.length != 1) {
    //         return next({
    //             code: "USER_NOT_FOUND",
    //         });
    //     }

    //     // select success
    //     const row = results[0];

    //     // 비밀번호 확인
    //     try {
    //         const compare = await bcrypt.compare(password, row.password);

    //         // 비밀번호 틀림
    //         if (!compare) {
    //             return next({
    //                 code: "INVALID_USER",
    //             });
    //         }

    //         // 삭제된 유저의 경우
    //         if (row.deleted_at != null) {
    //             return next({
    //                 code: "USER_NOT_FOUND",
    //             });
    //         }

    //         // success
    //         // 계정 삭제 작업
    //         const currentTime = new Date();
    //         const query = `UPDATE MEMBER_TB SET deleted_at = ? WHERE member_id = ?;`;
    //         db.execute(query, [currentTime, userId], (err, results) => {
    //             if (err) {
    //                 return next({
    //                     code: "SERVER_INTERNAL_ERROR",
    //                 });
    //             }

    //             // 영향받은 rows가 존재하지 않는 경우 (그럴 수 있나??)
    //             if (results.affectedRows <= 0) {
    //                 return next({
    //                     code: "SERVER_INTERNAL_ERROR",
    //                 });
    //             }

    //             // user delete success!!
    //             return res.success({
    //                 userId: userId,
    //                 deletedAt: currentTime,
    //             });
    //         });
    //     } catch (e) {
    //         return next({
    //             code: "SERVER_INTERNAL_ERROR",
    //         });
    //     }
    // });

    // Redis에서 유저의 모든 refresh Token 삭제
    try {
        await deleteValue(userId);

        // token 쿠키 삭제
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

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
        // Redis 삭제 실패
        return next({
            code: "SERVER_INTERNAL_ERROR",
        });
    }

    // // 계정 삭제 작업
    // const currentTime = new Date();
    // const query = `UPDATE MEMBER_TB SET deleted_at = ? WHERE member_id = ?;`;
    // db.execute(query, [currentTime, userId], (err, results) => {
    //     if (err) {
    //         return next({
    //             code: "SERVER_INTERNAL_ERROR",
    //         });
    //     }

    //     // 영향받은 rows가 존재하지 않는 경우 (그럴 수 있나??)
    //     if (results.affectedRows <= 0) {
    //         return next({
    //             code: "SERVER_INTERNAL_ERROR",
    //         });
    //     }

    //     // user delete success!!
    //     return res.success({
    //         userId: userId,
    //         deletedAt: currentTime,
    //     });
    // });
});

// 회원 정보 요청
router.get("/", authenticateToken, (req, res, next) => {
    const { userId } = req.user;

    const query = `
        SELECT 
            member_id, 
            nickname, 
            email, 
            gender, 
            birth_date, 
            diabetes_type, 
            created_at
        FROM MEMBER_TB 
        WHERE member_id = ?`;
    db.execute(query, [userId], (err, rows) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 유저 존재 안함 (가능한가?)
        if (rows.length < 1) {
            return next({
                code: "USER_NOT_FOUND",
            });
        }

        // 정보 보내주기
        return res.success({
            userId: rows[0].member_id,
            nickname: rows[0].nickname,
            email: rows[0].email,
            gender: rows[0].gender,
            birth_date: rows[0].birth_date,
            diabetes_type: rows[0].diabetes_type,
            created_at: rows[0].created_at,
        });
    });
});

// 회원 정보 수정 (jwt)
router.patch("/", authenticateToken, async (req, res, next) => {
    const { userId } = req.user;
    const { nickname, password, gender, birthDate, diabetesType } = req.body;

    // TODO : 회원 가입 유효성 검사를 이곳으로 가져와서 확인

    console.log(req.body);

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
    if (password !== null && password !== undefined) {
        updates.push("password = ?");
        // 암호화
        const cryptedPassword = await bcrypt.hash(password, 10);
        params.push(cryptedPassword);
        // 이건 반환 안한다
        // data["password"] = cryptedPassword;
    }
    if (gender !== null && gender !== undefined) {
        updates.push("gender = ?");
        params.push(gender);
        data["gender"] = gender;
    }
    if (birthDate !== null && birthDate !== undefined) {
        updates.push("birth_date = ?");
        params.push(birthDate);
        data["birthDate"] = birthDate;
    }
    if (diabetesType !== null && diabetesType !== undefined) {
        updates.push("diabetes_type = ?");
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
            console.log(err);
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
router.post("/logout", authenticateToken, async (req, res, next) => {
    // const { userId } = req.body;
    const { userId } = req.user;

    // Redis에서 유저의 모든 refresh Token 삭제
    try {
        await deleteValue(userId);

        // token 쿠키 삭제
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.success({
            userId: userId,
        });
    } catch (e) {
        // Redis 삭제 실패
        return next({
            code: "SERVER_INTERNAL_ERROR",
        });
    }

    // // 유저의 모든 refreshToken 삭제
    // const query = `DELETE FROM REFRESH_TOKEN_TB WHERE member_id = ?`;
    // db.execute(query, [userId], (err, results) => {
    //     if (err) {
    //         return next({
    //             code: "SERVER_INTERNAL_ERROR",
    //         });
    //     }

    //     // token 쿠키 삭제
    //     res.clearCookie("accessToken");
    //     res.clearCookie("refreshToken");

    //     return res.success({
    //         userId: userId,
    //     });
    // });
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

// 비밀 번호 재설정 요청
router.post("/password-reset-requests", (req, res, next) => {
    const { email } = req.body;

    // 유효한 이메일인지 확인
    const query = `
        SELECT member_id, 
            nickname, 
            email, 
            gender, 
            birth_date, 
            diabetes_type
        FROM MEMBER_TB 
        WHERE email = ? AND deleted_at IS NULL
    `;
    db.execute(query, [email], async (err, rows) => {
        if (err) {
            return next({
                code: "SERVER_INTERNAL_ERROR",
            });
        }

        // 유저 없음
        if (rows.length < 1) {
            return next({
                code: "USER_NOT_FOUND",
            });
        }

        // 유저 존재한다면 리셋링크가 담긴 메일을 보내준다
        // TODO : 서버의 url이 실제 서비스되는 url이어야 한다.
        const token = jwt.sign(
            { email },
            process.env.RESET_PASSWORD_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        const resetLink = `http://localhost:3000/reset-password/${token}`;

        try {
            // redis에 email을 key로 token을 저장
            await setTemporaryValue(email, token, resetPasswordTokenExpiredIn);

            // 메일 전송
            await sendResetEmail(email, resetLink);
            return res.success({
                email: email,
            });
        } catch (e) {
            // console.log(e);
            return next({
                code: "SERVER_SERVICE_UNAVAILABLE",
            });
        }
    });
});

// 비밀 번호 재설정
router.put("/password/:token", async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // jwt를 통해 decode
        const user = await verifyToken(
            token,
            process.env.RESET_PASSWORD_TOKEN_SECRET
        );
        const email = user.email;
        console.log(email);

        // redis에 존재하는 token인지 확인
        const getRedisToken = await getValue(email);
        // redis에 토큰이 없거나 다른 경우 (null 검사도 하는 이유는 둘 모두 null일 수 있으므로)
        if (getRedisToken == null || token != getRedisToken) {
            // 비정상 토큰
            return next({
                code: "AUTH_EXPIRED_TOKEN",
            });
        }

        // 토큰에 문제가 없으면 비밀번호 변경
        // password 암호화
        const cryptedPassword = await bcrypt.hash(password, 10);
        const query = `
            UPDATE MEMBER_TB
            SET password = ?
            WHERE email = ?`;
        db.execute(
            query,
            [cryptedPassword, user.email],
            async (err, results) => {
                if (err) {
                    return next({
                        code: "SERVER_INTERNAL_ERROR",
                    });
                }

                // 비번 변경이 안된 경우 (유저 없다)
                if (results.affectedRows < 1) {
                    return next({
                        code: "USER_NOT_FOUND",
                    });
                }

                // 변경이 정상적으로 된 경우
                // 한 번 사용한 토큰을 다시 사용할 수 없도록 redis에서 삭제
                try {
                    await deleteValue(email);

                    // 성공 응답
                    return res.success({
                        email: user.email,
                    });
                } catch (e) {
                    // Redis 저장 실패
                    return next({
                        code: "SERVER_INTERNAL_ERROR",
                    });
                }
            }
        );
    } catch (e) {
        // 토큰에 문제가 있다! 에러 발생 (클라이언트에서는 무조건 만료로 띄워줄 것)
        // console.log(e);
        return next({
            code: "AUTH_EXPIRED_TOKEN",
        });
    }
});

module.exports = router;
