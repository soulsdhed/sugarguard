const ERROR_CODES = require("../conf/errorCode");

const errorHandler = (err, req, res, next) => {
    const errorCode =
        ERROR_CODES[err.code] || ERROR_CODES.SERVER_INTERNAL_ERROR;
    res.status(errorCode.statusCode).json({
        success: false,
        error: {
            code: err.code,
            message: errorCode.message,
        },
    });
};

module.exports = errorHandler;
