"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/signin", auth_controller_1.AuthController.userSignin);
router.post("/forget-password", auth_controller_1.AuthController.forgetPassword);
router.patch("/set-password", auth_controller_1.AuthController.setNewPassword);
router.get("/user", (0, auth_1.default)(client_1.USER_ROLE.CUSTOMER), auth_controller_1.AuthController.getUserDashboard);
router.get("/admin", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), auth_controller_1.AuthController.getAdminDashboard);
router.get("/vendor", (0, auth_1.default)(client_1.USER_ROLE.VENDOR), auth_controller_1.AuthController.getVendorDashboard);
exports.AuthRouter = router;
