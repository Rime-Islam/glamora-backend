"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const order_controller_1 = require("./order.controller");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Customer Routes
router.get("/single-order/:id", (0, auth_1.default)(client_1.USER_ROLE.ADMIN, client_1.USER_ROLE.VENDOR, client_1.USER_ROLE.CUSTOMER), order_controller_1.OrderController.getSingleOrder);
router.get("/my-order", (0, auth_1.default)(client_1.USER_ROLE.CUSTOMER), order_controller_1.OrderController.getSingleCustomerAllOrder);
router.get("/pending-order", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), order_controller_1.OrderController.getPendingOrder);
router.get("/shop-order", (0, auth_1.default)(client_1.USER_ROLE.VENDOR), order_controller_1.OrderController.getSpeceficShopOrder);
router.post("/make-payment", (0, auth_1.default)(client_1.USER_ROLE.CUSTOMER), order_controller_1.OrderController.orderProduct);
// Admin Routes
router.get("/all-orders", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), order_controller_1.OrderController.getAllOrder);
router.patch("/update/:id", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), order_controller_1.OrderController.updateOrder);
exports.OrderRouter = router;
