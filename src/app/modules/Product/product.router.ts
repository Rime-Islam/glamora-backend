import { Router } from "express";
import auth from "../../middlewares/auth";
import { ProductController } from "./product.controller";
import { USER_ROLE } from "@prisma/client";



const router = Router();
router.post("/add-product", auth(USER_ROLE.VENDOR), ProductController.addProduct);
router.post("/clone-product", auth(USER_ROLE.VENDOR), ProductController.cloneProduct);
router.get("/", ProductController.allProduct);
router.post("/flash-sale", ProductController.flashProduct);
router.get("/:id", ProductController.singleProduct);
router.get("/search", ProductController.searchProduct);
router.patch("/:id", auth(USER_ROLE.VENDOR), ProductController.updateProduct);
router.delete("/:id", auth(USER_ROLE.VENDOR), ProductController.deleteProduct);

// router.get("/", auth(USER_ROLE.VENDOR), ShopController.getVendorShop);
export const ProductRouter = router;