const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser"); // 쿠키
const rateLimit = require("express-rate-limit");
const { client: redisClient } = require("./conf/redisClient"); // redisClient.js에서 Redis 클라이언트 및 함수 가져오기
// const {
//     setTemporaryValue,
//     setPermanentValue,
//     getValue,
//     deleteValue
// } = require('./utils/redisUtils');

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

// 서버 종료 시 Redis 클라이언트 닫기
// process.on('SIGINT', () => {
//     redisClient.quit(() => {
//         console.log('Redis client disconnected');
//         process.exit(0);
//     });
// });

// app.get('/check-redis', async (req, res) => {
//     try {
//         const isConnected = await checkRedisConnection();
//         console.log('isConnected:', isConnected); // 디버깅 로그 추가
//         if (isConnected) {
//             res.send('Redis is connected');
//         } else {
//             res.status(500).send('Redis is not connected');
//         }
//     } catch (error) {
//         console.error('Error in /check-redis:', error); // 디버깅 로그 추가
//         res.status(500).send('Redis is not connected');
//     }
// });

// app.get("/redis-test", async (req, res) => {
//     console.log("test");

//     try {
//         await setTemporaryValue('tempKey', 'tempValue', 60); // 60초 동안 저장
//         res.send('Temporary value set for 60 seconds');
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Error setting temporary value');
//     }

//     // try {
//     //     await connectRedis(); // Ensure Redis is connected

//     //     // Promise 사용하여 Redis set 및 get
//     //     await redisClient.set('myKey', 'myValue');
//     //     console.log('Set result: OK'); // OK

//     //     const value = await redisClient.get('myKey');
//     //     if (value) {
//     //         console.log('Value:', value);
//     //         res.send(`Value: ${value}`);
//     //     } else {
//     //         console.log('Key not found');
//     //         res.send('Key not found');
//     //     }
//     // } catch (err) {
//     //     console.error('Error in /redis-test:', err);
//     //     res.status(500).send('Error in /redis-test');
//     // }
// });

app.listen(process.env.PORT, async () => {
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
