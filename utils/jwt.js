const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// TODO : 추후 30분으로 다시 수정
const accessTokenExpiresIn = 300 * 60; // 30분
const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7일

const generateAccessToken = (res, userId) => {
    const user = { userId: userId }
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: `${accessTokenExpiresIn}s` });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: accessTokenExpiresIn * 1000,
    });
    return accessToken;
};

const generateRefreshToken = (res, userId) => {
    const user = { userId: userId }
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: `${refreshTokenExpiresIn}s` });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpiresIn * 1000,
    });
    return refreshToken;
};

module.exports = {
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    generateAccessToken,
    generateRefreshToken,
};
