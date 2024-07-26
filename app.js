const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser"); // 쿠키
// const session = require("express-session"); // 세션 + 주상이 수정함
// const fileStore = require("session-file-store")(session); // 세션 저장소 + 주상이 수정함
const rateLimit = require("express-rate-limit");
// const { spawn } = require('child_process');
// const path = require('path');

// router
const mainRouter = require("./routes/mainRouter");
const apiRouter = require("./routes/apiRouter");

// middleware
const errorHandler = require("./middlewares/errorHandler");
const successHandler = require("./middlewares/successHandler");
const timeoutMiddleware = require("./middlewares/timeoutMiddleware");

// express 설정
const app = express();
// let flaskProcess;

// 타임 아웃 미들웨어 (20초 -> 플라스크 응답이 너무 느리다...)
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

// 쿠키
app.use(cookieParser());

app.use(express.static(__dirname + "/public")); //주상
app.use(express.static(__dirname + "/script")); //주상
app.use(express.static(__dirname + "/img")); //주상

// 성공 처리 미들웨어
app.use(successHandler);

app.use("/", mainRouter);

// api call 제한
app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000, // 1분
        max: 100, // 최대 100개 요청
        message: "API rate limit exceeded.",
    })
);
app.use("/api", apiRouter);

// 에러 처리 미들웨어
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Port ${process.env.PORT} : Server Start`);

    // // Flask 서버를 가상 환경에서 실행
    // const venvPath = path.join(__dirname, './flask/venv/Scripts');
    // const flaskAppPath = path.join(__dirname, './flask/app.py');

    // // Waitress를 사용하여 Flask 서버 실행
    // flaskProcess = spawn(path.join(venvPath, 'python'), [flaskAppPath]);
    // console.log(`Port ${process.env.FLASK_PORT} : Flask Server Start`);

    // flaskProcess.stdout.on('data', (data) => {
    //     console.log(`Flask stdout: ${data}`);
    // });

    // flaskProcess.stderr.on('data', (data) => {
    //     console.error(`Flask stderr: ${data}`);
    // });

    // flaskProcess.on('close', (code) => {
    //     console.log(`Flask process exited with code ${code}`);
    // });
});

// process.on('SIGINT', () => {
//     console.log('Stopping servers...');
//     if (flaskProcess) flaskProcess.kill();
//     process.exit();
// });

// process.on('SIGTERM', () => {
//     console.log('Stopping servers...');
//     if (flaskProcess) flaskProcess.kill();
//     process.exit();
// });
