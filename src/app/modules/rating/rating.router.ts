import { Router } from "express";
import auth from "../../middlewares/auth";
import { RatingController } from "./rating.controller";
import { USER_ROLE } from "@prisma/client";

const router = Router();
router.post("/add-rating", auth(USER_ROLE.CUSTOMER), RatingController.addRating);

router.get(
  "/get-rating-by-shop",
  auth(USER_ROLE.VENDOR),
  RatingController.getUserRatingByShop
);
router.patch("/reply", auth(USER_ROLE.VENDOR), RatingController.replyToReview);

export const RatingRouter = router;