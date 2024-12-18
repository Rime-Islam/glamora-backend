import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { pickField } from "../../utils/pickFields";
import sendResponse from "../../utils/sendResponse";
import { ShopService } from "./shop.service";

const createShop = catchAsync(async (req, res) => {
    const result = await ShopService.createShop(req.body, req.user);
  console.log(req.body)
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Shop Created Successfully",
      data: result,
    });
  });
  
  //for user
  const getAllVendorShop = catchAsync(async (req, res) => {
    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
    const result = await ShopService.getAllVendorShop(paginationData);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All Shop are fetched Successfully",
      data: result.data,
      meta: result.meta,
    });
  });
  
  const getSingleVendorShop = catchAsync(async (req, res) => {
    const result = await ShopService.getSingleVendorShop(req.params?.id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Shop is fetched Successfully",
      data: result,
    });
  });
  
 
  const getVendorsShop = catchAsync(async (req, res) => {
    const result = await ShopService.getVendorShop(req.user);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Shop are fetched Successfully",
      data: result,
    });
  });
  
  const getVendorsSingleShop = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ShopService.getVendorSingleShop(req.user, id);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Shop data is fetched Successfully",
      data: result,
    });
  });
  
  const blockShop = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ShopService.blockShop(id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Shop active status changed.",
      data: result,
    });
  });

  const followShop = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user as JwtPayload & { userEmail: string; role: string };
    const result = await ShopService.followShop(id, user);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Shop followed successfull",
      data: result,
    });
  });
  
  const unfollowShop = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user as JwtPayload & { userEmail: string; role: string };
    const result = await ShopService.unfollowShop(id, user);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Shop unfollow successfull",
      data: result,
    });
  });
  export const ShopController = {
    createShop,
    getVendorsShop,
    getVendorsSingleShop,
    getAllVendorShop,
    getSingleVendorShop,
    blockShop,
    unfollowShop,
    followShop

  };