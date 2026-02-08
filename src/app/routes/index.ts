import express from "express";
import { UserRouter } from "../modules/User/user.router";
import { AuthRouter } from "../modules/Auth/auth.router";
import { CategoryRouter } from "../modules/Category/category.router";
import { ShopRouter } from "../modules/Shop/shop.router";
import { ProductRouter } from "../modules/Product/product.router";
import { OrderRouter } from "../modules/Order/order.router";
import { PaymentRouter } from "../modules/Payment/payment.router";
import { CuponRouter } from "../modules/Coupon/coupon.router";
import { RatingRouter } from "../modules/rating/rating.router";

const router = express.Router();
const moduleRoutes = [
  {
    path: "/user",
    route: UserRouter,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/category",
    route: CategoryRouter,
  },
  {
    path: "/shop",
    route: ShopRouter,
  },
  {
    path: "/product",
    route: ProductRouter,
  },
  {
    path: "/order",
    route: OrderRouter,
  },
  {
    path: "/payment",
    route: PaymentRouter,
  },
  {
    path: "/cupon",
    route: CuponRouter,
  },
  {
    path: "/rating",
    route: RatingRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
