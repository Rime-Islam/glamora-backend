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
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickFields_1 = require("../../utils/pickFields");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const orderProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.createOrderIntoDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Order placed successfully",
    });
}));
const getSingleCustomerAllOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationData = (0, pickFields_1.pickField)(req.query, ["page", "limit", "sort"]);
    const filter = (0, pickFields_1.pickField)(req.query, ["status"]);
    const result = yield order_service_1.OrderService.getSingleCustomerAllOrder(req.user, paginationData, filter);
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        statusCode: 200,
        success: true,
        message: "Orders are fetched successfully",
    });
}));
const getSingleOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_service_1.OrderService.getSingleOrder(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Orders is fetched successfully",
    });
}));
const getAllOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationData = (0, pickFields_1.pickField)(req.query, ["page", "limit", "sort"]);
    const result = yield order_service_1.OrderService.getAllOrder(paginationData);
    (0, sendResponse_1.default)(res, {
        meta: result.meta,
        data: result.data,
        statusCode: 200,
        success: true,
        message: "All Orders are fetched successfully",
    });
}));
const updateOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.updateOrder(req.params.id);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Orders is updated successfully",
    });
}));
const getPendingOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationData = (0, pickFields_1.pickField)(req.query, ["page", "limit", "sort"]);
    const result = yield order_service_1.OrderService.getPendingOrder(paginationData);
    (0, sendResponse_1.default)(res, {
        meta: result.meta,
        data: result.data,
        statusCode: 200,
        success: true,
        message: "Pending Orders are fetched successfully",
    });
}));
const getSpeceficShopOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const paginationData = (0, pickFields_1.pickField)(req.query, ["page", "limit", "sort"]);
    const filter = (0, pickFields_1.pickField)(req.query, ["status"]);
    const result = yield order_service_1.OrderService.getSpecificShopOrder(userData, paginationData, filter);
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        statusCode: 200,
        success: true,
        message: "Shop Orders are fetched successfully",
    });
}));
exports.OrderController = {
    orderProduct,
    getSpeceficShopOrder,
    getSingleCustomerAllOrder,
    getSingleOrder,
    getPendingOrder,
    getAllOrder,
    updateOrder,
};
