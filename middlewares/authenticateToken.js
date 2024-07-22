const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log(token);

    if (!token)
        return next({
            code: "AUTH_INVALID_TOKEN",
        });

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
