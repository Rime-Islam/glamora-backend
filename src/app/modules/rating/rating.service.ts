import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import { IPaginationOptions } from "../../interface/pagination.interface";
import prisma from "../../utils/prisma";
import { paginationHelper } from "../../utils/paginationHelper";
import { IReview } from "./rating.interface";

const addRating = async (
    data: IReview,
    userData: JwtPayload & { userEmail: string; role: string }
  ) => {
    const cId = await prisma.customer.findUnique({
      where: { email: userData.userEmail },
    });
  
    if (!cId) {
      throw new ApiError(404, "Cant Add Review");
    }
  
    const result = await prisma.review.create({
      data: { ...data, customerId: cId?.customerId },
    });
    return result;
  };
  
  const getUserReviewByShop = async (
    userData: JwtPayload & { userEmail: string; role: string },
    paginationData: IPaginationOptions
  ) => {
    const { page, limit, skip } =
      paginationHelper.calculatePagination(paginationData);
    const result = await prisma.review.findMany({
      where: {
        orderItem: {
          shop: { vendor: { email: userData.userEmail } },
        },
      },
      include: {
        customer: { select: { customerId: true, email: true, name: true } },
        product: { select: { name: true, productId: true, images: true } },
      },
      skip: skip,
      take: limit,
      orderBy: paginationData?.sort
        ? {
            [paginationData.sort.split("-")[0]]:
              paginationData.sort.split("-")[1],
          }
        : {
            createdAt: "desc",
          },
    });
    console.log(skip);
    const total = await prisma.review.count({
      where: {
        orderItem: {
          shop: { vendor: { email: userData.userEmail } },
        },
      },
    });
  
    return {
      meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
      data: result,
    };
  };
  
  const replyToReview = async (data: { id: string; vendorReply: string }) => {
    // Fetch the existing review
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewId: data.id,
      },
      select: {
        vendorReply: true,
      },
    });
  
   
    if (existingReview?.vendorReply) {
      throw new Error("Vendor reply already exists. Update not allowed.");
    }
  
  
    const result = await prisma.review.update({
      where: {
        reviewId: data.id,
      },
      data: {
        vendorReply: data.vendorReply,
      },
    });
  
    return result;
  };
  
  export const RatingService = {
    addRating,
    getUserReviewByShop,
    replyToReview,
  };