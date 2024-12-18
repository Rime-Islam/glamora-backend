"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        success: false,
        message: "Route NOT FOUND!",
    });
};
exports.default = notFound;
