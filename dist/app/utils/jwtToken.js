"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const configs_1 = require("../configs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const generateToken = (data, expiresIn = configs_1.config.jwt_secrate_date) => {
    const token = jsonwebtoken_1.default.sign(data, configs_1.config.jwt_secrate, {
        expiresIn: expiresIn
    });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const secretKey = configs_1.config.jwt_secrate;
        if (!secretKey) {
            throw new Error("JWT secret key is not defined");
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey, { algorithms: ['HS256'] });
        return decoded;
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            console.error("JWT expired at:", error.expiredAt);
            throw new ApiError_1.default(401, "Token has expired. Please login again.");
        }
        console.error("JWT verification error:", error.message);
        throw new ApiError_1.default(401, "Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
