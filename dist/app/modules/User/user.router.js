"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/signup", user_controller_1.UserController.createUser);
router.get("/", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
router.patch("/block/:id", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), user_controller_1.UserController.blockedUser);
router.patch("/update-password", (0, auth_1.default)(client_1.USER_ROLE.ADMIN, client_1.USER_ROLE.VENDOR, client_1.USER_ROLE.CUSTOMER), user_controller_1.UserController.setNewPassword);
router.patch("/delete/:id", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRouter = router;
