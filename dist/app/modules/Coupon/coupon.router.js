"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuponRouter = void 0;
const express_1 = require("express");
const coupon_controller_1 = require("./coupon.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/create-cupon", (0, auth_1.default)(client_1.USER_ROLE.VENDOR), coupon_controller_1.CuponController.createCupon);
router.get("/get-cupon/:id", (0, auth_1.default)(client_1.USER_ROLE.VENDOR, client_1.USER_ROLE.CUSTOMER), coupon_controller_1.CuponController.getShopCupon);
exports.CuponRouter = router;
