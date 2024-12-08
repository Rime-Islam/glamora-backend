import catchAsync from "../../utils/catchAsync";
import prisma from "../../utils/prisma";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";



const createCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.createCategory(req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Category Created Successfully",
      data: result,
    });
  });
  
  const getAllCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.getAllCategory();
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All category are fetched successfully",
      data: result,
    });
  });
  
  const updateCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.updateCategory(req.params.id, req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Category is updated successfully",
      data: result,
    });
  });
  
  const deleteCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.deleteCategory(req.params.id);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Category is deleted successfully",
      data: result,
    });
  });
  
  export const CategoryController = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
  };