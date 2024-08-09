const jwt = require("jsonwebtoken");
// redis
const { getValue } = require("./redisUtils");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// TODO : 추후 30분으로 다시 수정
const accessTokenExpiresIn = 300 * 60; // 30분
const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7일
const resetPasswordTokenExpiredIn = 60 * 60; // 1시간

const generateAccessToken = (res, userId) => {
  const user = { userId: userId };
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: `${accessTokenExpiresIn}s`,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: accessTokenExpiresIn * 1000,
  });
  return accessToken;
};

const generateRefreshToken = (res, userId) => {
  const user = { userId: userId };
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: `${refreshTokenExpiresIn}s`,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiresIn * 1000,
  });
  return refreshToken;
};

const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

const getUserIdInRefreshToken = async (req) => {
  const token = req.cookies.refreshToken;
  // console.log("token", token);

  if (!token) return undefined;
  try {
    // token으로부터 userId 가져오기
    const user = await verifyToken(token, REFRESH_TOKEN_SECRET);

    // 가져온 userId로부터 Redis에서 refresh token 조회
    const getRefreshToken = await getValue(user.userId);
    // redis에 토큰이 없거나 다른 경우 (null 검사도 하는 이유는 둘 모두 null일 수 있으므로)
    if (getRefreshToken == null || token != getRefreshToken) {
      // 비정상 토큰 ()
      return undefined;
    }

    return user.userId;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

module.exports = {
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  resetPasswordTokenExpiredIn,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  getUserIdInRefreshToken,
};
