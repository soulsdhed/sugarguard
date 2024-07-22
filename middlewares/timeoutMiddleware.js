const ERROR_CODES = require("../conf/errorCode");

const timeoutMiddleware = (timeout) => {
    return function (req, res, next) {
        const timer = setTimeout(() => {
            next({ code: "SERVER_TIMEOUT" });
        }, timeout);

        res.on("finish", () => clearTimeout(timer));
        res.on("close", () => clearTimeout(timer));

        next();
    };
};

module.exports = timeoutMiddleware;
