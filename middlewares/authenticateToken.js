const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    console.log("token1", token);
    // header에 토큰이 없는 경우
    if (!token) {
        // 쿠키에서 토큰을 찾는다
        token = req.cookies.accessToken;
        console.log("token2", token);

        // 그래도 없으면 Error
        if (!token) {
            return next({
                code: "AUTH_INVALID_TOKEN",
            });
        }
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return next({
                    code: "AUTH_EXPIRED_TOKEN",
                });
            }
            return next({
                code: "AUTH_UNAUTHORIZED",
            });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
