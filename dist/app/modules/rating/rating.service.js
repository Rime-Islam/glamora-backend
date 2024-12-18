"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const addRating = (data, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const cId = yield prisma_1.default.customer.findUnique({
        where: { email: userData.userEmail },
    });
    if (!cId) {
        throw new ApiError_1.default(404, "Cant Add Review");
    }
    const result = yield prisma_1.default.review.create({
        data: Object.assign(Object.assign({}, data), { customerId: cId === null || cId === void 0 ? void 0 : cId.customerId }),
    });
    return result;
});
const getUserReviewByShop = (userData, paginationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const result = yield prisma_1.default.review.findMany({
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
        orderBy: (paginationData === null || paginationData === void 0 ? void 0 : paginationData.sort)
            ? {
                [paginationData.sort.split("-")[0]]: paginationData.sort.split("-")[1],
            }
            : {
                createdAt: "desc",
            },
    });
    console.log(skip);
    const total = yield prisma_1.default.review.count({
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
});
const replyToReview = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the existing review
    const existingReview = yield prisma_1.default.review.findUnique({
        where: {
            reviewId: data.id,
        },
        select: {
            vendorReply: true,
        },
    });
    if (existingReview === null || existingReview === void 0 ? void 0 : existingReview.vendorReply) {
        throw new Error("Vendor reply already exists. Update not allowed.");
    }
    const result = yield prisma_1.default.review.update({
        where: {
            reviewId: data.id,
        },
        data: {
            vendorReply: data.vendorReply,
        },
    });
    return result;
});
exports.RatingService = {
    addRating,
    getUserReviewByShop,
    replyToReview,
};
