import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "@prisma/client";


const router = Router();

router.post("/signin", AuthController.userSignin);
router.post("/forget-password", AuthController.forgetPassword);
router.patch("/set-password", AuthController.setNewPassword);
router.get("/user", auth(USER_ROLE.CUSTOMER), AuthController.getUserDashboard);
router.get(
  "/admin",
  auth(USER_ROLE.ADMIN),
  AuthController.getAdminDashboard
);
router.get("/vendor", auth(USER_ROLE.VENDOR), AuthController.getVendorDashboard);

export const AuthRouter = router;