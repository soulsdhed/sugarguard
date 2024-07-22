const express = require("express");
const nunjucks = require("nunjucks");
// const cookieParser = require("cookie-parser"); // 쿠키
const session = require("express-session"); // 세션
const fileStore = require("session-file-store")(session); // 세션 저장소

const app = express();
const PORT = 3000;

const mainRouter = require("./routes/mainRouter");
const apiRouter = require("./routes/apiRouter");

app.set("view engine", "html");

nunjucks.configure("views", {
    express: app,
    watch: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        httpOnly: true,
        resave: false,
        secret: "secret",
        store: new fileStore(),
        saveUninitialized: false,
        // retries: 1,
        // async writeFile(req, res, next) {
        //     await saveSession(req.session);
        //     next();
        // },
    })
);
// app.use(express.static(__dirname + "/public")); // Css파일 - 정적파일
app.use(express.static("public")); // Css파일 - 정적파일
app.use(express.static("script")); // Script - 정적파일

app.use("/", mainRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => {
    console.log("Port 3000 : Server Start");
});
