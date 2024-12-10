import { Router } from "express";
import auth from "../../middlewares/auth";
import { OrderController } from "./order.controller";
import { USER_ROLE } from "@prisma/client";

const router = Router();

// Customer Routes
router.get(
  "/single-order/:id",
 auth(USER_ROLE.ADMIN, USER_ROLE.VENDOR, USER_ROLE.CUSTOMER),
  OrderController.getSingleOrder
);

router.get(
  "/my-order",
  auth(USER_ROLE.CUSTOMER),
  OrderController.getSingleCustomerAllOrder
);

router.get(
  "/pending-order",
  auth(USER_ROLE.ADMIN),
  OrderController.getPendingOrder
);
router.get(
  "/shop-order/:id",
  auth(USER_ROLE.VENDOR),
  OrderController.getSpeceficShopOrder
);

router.post("/make-payment", auth(USER_ROLE.CUSTOMER), OrderController.orderProduct);

// Admin and Superadmin Routes
router.get(
  "/all-orders",
  auth(USER_ROLE.ADMIN),
  OrderController.getAllOrder
);

router.patch(
  "/update/:id", 
  auth(USER_ROLE.ADMIN),
  OrderController.updateOrder
);

export const OrderRouter = router;