module.exports = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = `Resource not found. Invalid ${err.path}`
    }

    const responseStatusCode = typeof err.statusCode === "number" ? err.statusCode : 500;


    res.status(responseStatusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    })

}