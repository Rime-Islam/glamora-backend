import { Router } from "express";
import { AuthController } from "./auth.controller";


const router = Router();

router.post("/signin", AuthController.userSignin);
router.post("/forget-password", AuthController.forgetPassword);
router.patch("/set-password", AuthController.setNewPassword);


export const AuthRouter = router;