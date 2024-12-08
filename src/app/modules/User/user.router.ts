import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "@prisma/client";


const router = Router();
router.post("/signup", UserController.createUser);
router.get("/", auth(USER_ROLE.ADMIN), UserController.getAllUsers);
router.patch(
    "/block/:id",
    auth(USER_ROLE.ADMIN),
    UserController.blockedUser
  );
  router.patch(
    "/delete/:id",
    auth(USER_ROLE.ADMIN),
    UserController.deleteUser
  );

export const UserRouter = router;