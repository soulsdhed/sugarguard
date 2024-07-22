const express = require("express");
const router = express.Router();
const db = require("../../conf/db");

// jwt
const {
    accessTokenExpiresIn,
    generateAccessToken,
} = require("../../utils/jwt");

// 엑세스 토큰 재발행
router.post("/token", (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1];

    // header의 refreshToken이 존재하는지 여부 확인
    const query = `SELECT refresh_token, member_id, expires_at 
        FROM REFRESH_TOKEN_TB 
        WHERE refresh_token = ?`;
    db.execute(query, [refreshToken], async (err, rows) => {
        if (err || rows.length <= 0) {
            return next({
                code: "AUTH_INVALID_TOKEN",
            });
        }

        // 조회 성공한 경우
        const row = rows[0];

        // 만료 여부 확인
        if (new Date(row.expires_at) < new Date()) {
            await db.execute("DELETE FROM REFRESH_TOKEN_TB WHERE token = ?", [
                refreshToken,
            ]);
            return next({
                code: AUTH_EXPIRED_TOKEN,
            });
        }

        // 새로운 accessToken 발행
        const user = {
            userId: row.member_id,
        };
        const accessToken = generateAccessToken(user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: accessTokenExpiresIn * 1000,
        });

        // client에 응답 (token 재발행 success)
        return res.success({
            accessToken: accessToken,
        });
    });
    // console.log(refreshToken);
});

module.exports = router;
