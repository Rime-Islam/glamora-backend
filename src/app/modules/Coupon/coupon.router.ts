import { Router } from "express";
import { CuponController } from "./coupon.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "@prisma/client";

const router = Router();

router.post("/create-cupon", auth(USER_ROLE.VENDOR), CuponController.createCupon);

router.get(
  "/get-cupon/:id",
  auth(USER_ROLE.VENDOR, USER_ROLE.CUSTOMER),
  CuponController.getShopCupon
);

export const CuponRouter = router;