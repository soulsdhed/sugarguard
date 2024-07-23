const express = require("express");
const nunjucks = require("nunjucks");
// const cookieParser = require("cookie-parser"); // 쿠키
// const session = require("express-session"); // 세션 + 주상이 수정함
// const fileStore = require("session-file-store")(session); // 세션 저장소 + 주상이 수정함
const rateLimit = require("express-rate-limit");

// router
const mainRouter = require("./routes/mainRouter");
const apiRouter = require("./routes/apiRouter");

// middleware
const errorHandler = require("./middlewares/errorHandler");
const successHandler = require("./middlewares/successHandler");
const timeoutMiddleware = require("./middlewares/timeoutMiddleware");

// express 설정
const app = express();

// 타임 아웃 미들웨어 (5초)
app.use(timeoutMiddleware(process.env.TIMEOUT));

app.set("view engine", "html");

nunjucks.configure("views", {
    express: app,
    watch: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//     session({
//         httpOnly: true,
//         resave: false,
//         secret: "secret",
//         store: new fileStore(),
//         saveUninitialized: false,
//         // retries: 1,
//         // async writeFile(req, res, next) {
//         //     await saveSession(req.session);
//         //     next();
//         // },
//     })
// );
app.use(express.static(__dirname + "/public")); //주상
app.use(express.static(__dirname + "/script")); //주상

// 성공 처리 미들웨어
app.use(successHandler);

app.use("/", mainRouter);

// api call 제한
app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000, // 1분
        max: 10, // 최대 10개 요청
        message: "API rate limit exceeded.",
    })
);
app.use("/api", apiRouter);

// 에러 처리 미들웨어
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Port ${process.env.PORT} : Server Start`);
});
