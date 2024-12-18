"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = require("../modules/User/user.router");
const auth_router_1 = require("../modules/Auth/auth.router");
const category_router_1 = require("../modules/Category/category.router");
const shop_router_1 = require("../modules/Shop/shop.router");
const product_router_1 = require("../modules/Product/product.router");
const order_router_1 = require("../modules/Order/order.router");
const payment_router_1 = require("../modules/Payment/payment.router");
const coupon_router_1 = require("../modules/Coupon/coupon.router");
const rating_router_1 = require("../modules/rating/rating.router");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_router_1.UserRouter
    },
    {
        path: "/auth",
        route: auth_router_1.AuthRouter
    },
    {
        path: "/category",
        route: category_router_1.CategoryRouter
    },
    {
        path: "/shop",
        route: shop_router_1.ShopRouter
    },
    {
        path: "/product",
        route: product_router_1.ProductRouter
    },
    {
        path: "/order",
        route: order_router_1.OrderRouter
    },
    {
        path: "/payment",
        route: payment_router_1.PaymentRouter
    },
    {
        path: "/cupon",
        route: coupon_router_1.CuponRouter
    },
    {
        path: "/rating",
        route: rating_router_1.RatingRouter
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
