import { Router } from "express";
import { ShopController } from "./shop.controller";
import { USER_ROLE } from "@prisma/client";
import auth from "../../middlewares/auth";





const router = Router();
router.post("/create-shop", auth(USER_ROLE.VENDOR), ShopController.createShop);

router.get("/", auth(USER_ROLE.VENDOR), ShopController.getVendorsShop);
router.get("/get-all-shop", ShopController.getAllVendorShop);
router.get("/get-single-shop/:id", ShopController.getSingleVendorShop);
router.get("/:id", auth(USER_ROLE.VENDOR), ShopController.getVendorsSingleShop);
router.post("/new-follow/:id", auth(USER_ROLE.CUSTOMER), ShopController.followShop);
router.delete(
  "/remove-follow/:id",
  auth(USER_ROLE.CUSTOMER),
  ShopController.unfollowShop
);
router.patch(
  "/block-shop/:id",
  auth(USER_ROLE.ADMIN),
  ShopController.blockShop
);

export const ShopRouter = router;