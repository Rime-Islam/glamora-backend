"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const rating_controller_1 = require("./rating.controller");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/add-rating", (0, auth_1.default)(client_1.USER_ROLE.CUSTOMER), rating_controller_1.RatingController.addRating);
router.get("/get-rating-by-shop", (0, auth_1.default)(client_1.USER_ROLE.VENDOR), rating_controller_1.RatingController.getUserRatingByShop);
router.patch("/reply", (0, auth_1.default)(client_1.USER_ROLE.VENDOR), rating_controller_1.RatingController.replyToReview);
exports.RatingRouter = router;
