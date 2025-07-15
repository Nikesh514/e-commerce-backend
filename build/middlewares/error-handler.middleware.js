"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
//custom error class
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.success = false;
        this.status = statusCode >= 400 && statusCode < 500
            ? 'fail' : 'error';
        Error.captureStackTrace(this, CustomError);
    }
}
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const status = err.status || 'error';
    const success = err.success || false;
    res.status(statusCode).json({
        message,
        success,
        status
    });
};
exports.errorHandler = errorHandler;
exports.default = CustomError;
