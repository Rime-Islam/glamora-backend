"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/create-category", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), category_controller_1.CategoryController.createCategory);
router.get("/", category_controller_1.CategoryController.getAllCategory);
router.patch("/:id", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), category_controller_1.CategoryController.updateCategory);
router.delete("/:id", (0, auth_1.default)(client_1.USER_ROLE.ADMIN), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRouter = router;
