"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode).send({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        meta: data === null || data === void 0 ? void 0 : data.meta,
        data: data === null || data === void 0 ? void 0 : data.data,
    });
};
exports.default = sendResponse;
