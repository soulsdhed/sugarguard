const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let accessToken = authHeader && authHeader.split(" ")[1];

  // header에 access token이 없는 경우
  if (!accessToken) {
    // 쿠키에서 access token을 찾는다
    accessToken = req.cookies.accessToken;
    // console.log("accessToken cookie", accessToken);

    // access token이 없는 경우
    if (!accessToken) {
      // refresh token이 있는지 확인한다 (쿠키에서만 없으면 아래로 갈 것이므로)
      let refreshToken = req.cookies.refreshToken;

      // refresh token 이 없으면 (너 토큰 없어 로그인 안했잖아)
      if (!refreshToken) {
        return next({
          code: "AUTH_UNAUTHORIZED",
        });
      }

      // 있는 경우 (정상 토큰인지 좀 봅시다)
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        // 정상 토큰이 아니거나 만료된 경우 (조작 토큰!?)
        if (err) {
          return next({
            code: "AUTH_INVALID_TOKEN",
          });
        }

        // 정상 토큰인 경우 (access token이 만료되었단다.)
        return next({
          code: "AUTH_EXPIRED_TOKEN",
        });
      });
    }
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next({
          code: "AUTH_EXPIRED_TOKEN",
        });
      }
      return next({
        code: "AUTH_INVALID_TOKEN",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
