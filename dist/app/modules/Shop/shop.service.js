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
exports.ShopService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const createShop = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.vendor.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.userEmail },
    });
    if (!userData) {
        throw new ApiError_1.default(404, "Failed to create Shop. User not found.");
    }
    const result = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, data), { vendorId: userData.vendorId }),
    });
    return result;
});
// for all
const getAllVendorShop = (paginationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const result = yield prisma_1.default.shop.findMany({
        where: { isBlackListed: false },
        include: { vendor: true, followers: true, products: true },
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
    const total = yield prisma_1.default.shop.count();
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
});
const getSingleVendorShop = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findUnique({
        where: {
            shopId: id,
        },
        include: {
            products: { include: { category: true } },
            followers: { include: { customer: { select: { email: true } } } },
        },
    });
    return result;
});
//for vendor
const getVendorShop = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.vendor.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.userEmail },
    });
    const result = yield prisma_1.default.shop.findMany({
        where: { vendorId: userData === null || userData === void 0 ? void 0 : userData.vendorId },
    });
    return result;
});
const getVendorSingleShop = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma_1.default.vendor.findUniqueOrThrow({
        where: { email: user === null || user === void 0 ? void 0 : user.userEmail },
    });
    const result = yield prisma_1.default.shop.findFirst({
        where: { shopId: id, vendorId: data.vendorId },
        include: { products: { include: { category: true } } },
    });
    return result;
});
const blockShop = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield prisma_1.default.shop.findUnique({
        where: {
            shopId: id,
        },
    });
    const result = yield prisma_1.default.shop.update({
        where: { shopId: id },
        data: { isBlackListed: !(previous === null || previous === void 0 ? void 0 : previous.isBlackListed) },
    });
    return result;
});
const followShop = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.customer.findUnique({
        where: { email: user.userEmail },
    });
    if (!userData) {
        throw new ApiError_1.default(404, "Shop not listed to follow list.Try again.");
    }
    const result = yield prisma_1.default.follower.create({
        data: { customerId: userData === null || userData === void 0 ? void 0 : userData.customerId, shopId: id },
    });
    return result;
});
const unfollowShop = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.customer.findUnique({
        where: { email: user.userEmail },
    });
    if (!userData) {
        throw new ApiError_1.default(404, "Shop not listed to follow list.Try again.");
    }
    const result = yield prisma_1.default.follower.delete({
        where: {
            shopId_customerId: {
                customerId: userData.customerId,
                shopId: id,
            },
        },
    });
    return result;
});
exports.ShopService = {
    createShop,
    getVendorShop,
    getVendorSingleShop,
    getAllVendorShop,
    getSingleVendorShop,
    followShop,
    unfollowShop,
    blockShop,
};
