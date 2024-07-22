const successHandler = (req, res, next) => {
    res.success = (data) => {
        res.status(200).json({
            success: true,
            data: data,
        });
    };
    next();
};

module.exports = successHandler;
