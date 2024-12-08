import express from "express";
import { UserRouter } from "../modules/User/user.router";
import { AuthRouter } from "../modules/Auth/auth.router";
import { CategoryRouter } from "../modules/Category/category.router";

const router = express.Router();
const moduleRoutes = [
{
path: "/user",
route: UserRouter
},
{
path: "/auth",
route: AuthRouter
},
{
path: "/category",
route: CategoryRouter
},

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
