import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import { pickField } from "../../utils/pickFields";


const addProduct = catchAsync(async (req, res) => {
    const result = await ProductService.addProduct(req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product added Successfully",
      data: result,
    });
  });
  
  const cloneProduct = catchAsync(async (req, res) => {
    const result = await ProductService.cloneProduct(req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product clone Successfully",
      data: result,
    });
  });
  
  const allProduct = catchAsync(async (req, res) => {
    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
  
    const filter = pickField(req.query, ["searchTerm", "categoryId"]);
    const result = await ProductService.getAllProduct(paginationData, filter);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product are fetched Successfully",
      data: result.data,
      meta: result.meta,
    });
  });
  
  const singleProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ProductService.getSingleProduct(id);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product is fetched Successfully",
      data: result,
    });
  });
  
  const updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
  
    const user = req.user as JwtPayload & { userEmail: string; role: string };
    const result = await ProductService.updateProduct(req.body, id, user);
 
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product updated Successfully",
      data: result,
    });
  });
  
  const deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user as JwtPayload & { userEmail: string; role: string };
    const result = await ProductService.deleteProduct(id, user);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Product deleted Successfully",
      data: result,
    });
  });
  
  const flashProduct = catchAsync(async (req, res) => {
    const result = await ProductService.flashProduct();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Flash product fetched Successfully",
      data: result,
    });
  });
  
  export const ProductController = {
    addProduct,
    updateProduct,
    deleteProduct,
    allProduct,
    singleProduct,
    flashProduct,
    cloneProduct,
  };