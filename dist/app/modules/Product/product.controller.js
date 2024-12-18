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
exports.ProductController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
const pickFields_1 = require("../../utils/pickFields");
const addProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.addProduct(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product added Successfully",
        data: result,
    });
}));
const cloneProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.cloneProduct(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product clone Successfully",
        data: result,
    });
}));
const allProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationData = (0, pickFields_1.pickField)(req.query, ["page", "limit", "sort"]);
    const filter = (0, pickFields_1.pickField)(req.query, ["searchTerm", "categoryId"]);
    const result = yield product_service_1.ProductService.allProduct(paginationData, filter);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product are fetched Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const singleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.ProductService.singleProduct(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product is fetched Successfully",
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield product_service_1.ProductService.updateProduct(req.body, id, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product updated Successfully",
        data: result,
    });
}));
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield product_service_1.ProductService.deleteProduct(id, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product deleted Successfully",
        data: result,
    });
}));
const flashProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.flashProduct();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Flash product fetched Successfully",
        data: result,
    });
}));
exports.ProductController = {
    addProduct,
    updateProduct,
    deleteProduct,
    allProduct,
    singleProduct,
    flashProduct,
    cloneProduct,
};
