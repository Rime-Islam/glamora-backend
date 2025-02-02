"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const userSignin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.userSignin(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Login successfull",
        data: result,
    });
}));
const forgetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.body.email;
    const result = yield auth_service_1.AuthService.forgetPassword(userEmail);
    (0, sendResponse_1.default)(res, {
        data: { token: result },
        statusCode: 200,
        success: true,
        message: "Password reset link sent to your email",
    });
}));
const setNewPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    const result = yield auth_service_1.AuthService.setUserNewPassword(data === null || data === void 0 ? void 0 : data.token, data === null || data === void 0 ? void 0 : data.password);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Password Updated Successfully",
    });
}));
const getUserDashboard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const result = yield auth_service_1.AuthService.getUserDashboard(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard data fetch successfully",
        data: result,
    });
}));
const getAdminDashboard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const result = yield auth_service_1.AuthService.getAdminDashboard(userData);
    console.log(result);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard data fetch successfully",
        data: result,
    });
}));
const getVendorDashboard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const result = yield auth_service_1.AuthService.getVendorDashboard(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard data fetch successfully",
        data: result,
    });
}));
exports.AuthController = {
    userSignin,
    forgetPassword,
    setNewPassword,
    getUserDashboard,
    getAdminDashboard,
    getVendorDashboard,
};
