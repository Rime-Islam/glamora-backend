import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "@prisma/client";


const router = Router();
router.post(
  "/create-category",
  auth(USER_ROLE.ADMIN),
  CategoryController.createCategory
);

router.get("/", CategoryController.getAllCategory);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  CategoryController.deleteCategory
);


export const CategoryRouter = router;