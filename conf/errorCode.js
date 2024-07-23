const ERROR_CODES = {
    // user
    USER_NOT_FOUND: {
        statusCode: 404,
        message: "The user with the given ID was not found.",
    },
    INVALID_USER: {
        statusCode: 401,
        message: "Invalid ID or password.",
    },
    // data
    DATA_NOT_FOUND: {
        statusCode: 404,
        message: "Data not found.",
    },
    // auth
    AUTH_INVALID_TOKEN: {
        statusCode: 401,
        message: "Invalid authentication token.",
    },
    AUTH_EXPIRED_TOKEN: {
        statusCode: 401,
        message: "Authentication token has expired.",
    },
    AUTH_UNAUTHORIZED: {
        statusCode: 401,
        message: "Unauthorized access.",
    },
    // validation error
    VALIDATION_ERROR: {
        statusCode: 400,
        message: "General Validation error.",
    },
    VALIDATION_MISSING_FIELD: {
        statusCode: 400,
        message: "Required field is missing.",
    },
    // client error
    // server error
    SERVER_INTERNAL_ERROR: {
        statusCode: 500,
        message: "An unexpected error occurred.",
    },
    SERVER_SERVICE_UNAVAILABLE: {
        statusCode: 500,
        message: "Service is temporarily unavailable.",
    },
    SERVER_TIMEOUT: {
        statusCode: 500,
        message: "Server timed out.",
    },
};

module.exports = ERROR_CODES;
