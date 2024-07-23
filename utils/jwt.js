const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// TODO : 추후 15분으로 다시 수정
const accessTokenExpiresIn = 15 * 60; // 15분
const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7일

const generateAccessToken = (user) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "150m" });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = {
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    generateAccessToken,
    generateRefreshToken,
};
