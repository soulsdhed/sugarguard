const express = require("express");
const nunjucks = require("nunjucks");
// const cookieParser = require("cookie-parser"); // 쿠키
// const session = require("express-session"); // 세션
// const fileStore = require("session-file-store")(session); // 세션 저장소

// router
const mainRouter = require("./routes/mainRouter");
const apiRouter = require("./routes/apiRouter");

// middleware
const errorHandler = require("./middlewares/errorHandler");
const sucessHandler = require("./middlewares/successHandler");
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

app.use("/", mainRouter);
app.use("/api", apiRouter);

// 에러 처리 미들웨어
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Port ${process.env.PORT} : Server Start`);
});
