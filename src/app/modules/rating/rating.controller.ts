import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { pickField } from "../../utils/pickFields";
import sendResponse from "../../utils/sendResponse";
import { RatingService } from "./rating.service";

const addRating = catchAsync(async (req, res) => {
    const user = req.user as JwtPayload & { userEmail: string; role: string };
  
    const result = await RatingService.addRating(req.body.data, user);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Rating added Successfully",
      data: result,
    });
  });
  
  const getUserRatingByShop = catchAsync(async (req, res) => {
    const user = req.user as JwtPayload & { userEmail: string; role: string };
    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
    const result = await RatingService.getUserReviewByShop(user, paginationData);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Rating is fetched by Shop",
      data: result.data,
      meta: result.meta,
    });
  });
  
  const replyToReview = catchAsync(async (req, res) => {
    const result = await RatingService.replyToReview(req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Replyed Given.",
      data: result,
    });
  });
  
  export const RatingController = {
    addRating,
    getUserRatingByShop,
    replyToReview,
  };
  