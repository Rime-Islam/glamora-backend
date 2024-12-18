"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const library_1 = require("@prisma/client/runtime/library");
const errorHandler = (err, req, res, next) => {
    var _a, _b;
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails = err;
    if (err instanceof ApiError_1.default) {
        // Handle custom AppError
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err;
    }
    else if (err instanceof library_1.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        statusCode = 400;
        if (err.code === "P2002") {
            // Unique constraint violation
            const fields = Array.isArray((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target)
                ? ((_b = err.meta) === null || _b === void 0 ? void 0 : _b.target).join(", ")
                : "field";
            message = `Duplicate value for ${fields}.`;
        }
        else if (err.code === "P2025") {
            // Record not found
            message = "The requested record was not found.";
        }
        else {
            message = "A database error occurred.";
        }
        errorDetails = {
            code: err.code,
            meta: err.meta,
        };
    }
    else if (err instanceof library_1.PrismaClientValidationError) {
        // Handle Prisma validation errors
        statusCode = 400;
        message = "Validation error occurred. Check your input.";
    }
    else if (err instanceof Error) {
        // Handle general JavaScript errors
        message = err.message || "Internal Server Error";
        if (process.env.NODE_ENV === "development") {
            errorDetails = { stack: err.stack };
        }
    }
    // Send response in desired structure
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        err: errorDetails,
    });
};
exports.default = errorHandler;
