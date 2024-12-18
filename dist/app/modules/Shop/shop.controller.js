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
exports.ShopController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickFields_1 = require("../../utils/pickFields");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const shop_service_1 = require("./shop.service");
const createShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_service_1.ShopService.createShop(req.body, req.user);
    console.log(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop Created Successfully",
        data: result,
    });
}));
//for user
const getAllVendorShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationData = (0, pickFields_1.pickField)(req.query, ["page", "limit", "sort"]);
    const result = yield shop_service_1.ShopService.getAllVendorShop(paginationData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All Shop are fetched Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleVendorShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield shop_service_1.ShopService.getSingleVendorShop((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop is fetched Successfully",
        data: result,
    });
}));
const getVendorsShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_service_1.ShopService.getVendorShop(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop are fetched Successfully",
        data: result,
    });
}));
const getVendorsSingleShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield shop_service_1.ShopService.getVendorSingleShop(req.user, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop data is fetched Successfully",
        data: result,
    });
}));
const blockShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield shop_service_1.ShopService.blockShop(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop active status changed.",
        data: result,
    });
}));
const followShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield shop_service_1.ShopService.followShop(id, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop followed successfull",
        data: result,
    });
}));
const unfollowShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield shop_service_1.ShopService.unfollowShop(id, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop unfollow successfull",
        data: result,
    });
}));
exports.ShopController = {
    createShop,
    getVendorsShop,
    getVendorsSingleShop,
    getAllVendorShop,
    getSingleVendorShop,
    blockShop,
    unfollowShop,
    followShop
};
