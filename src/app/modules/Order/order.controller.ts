import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { pickField } from "../../utils/pickFields";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

const orderProduct = catchAsync(async (req, res) => {
  const result = await OrderService.createOrderIntoDB(
    req.body,
    req.user as JwtPayload & { role: string; userEmail: string }
  );

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Order placed successfully",
  });
});


const getSingleCustomerAllOrder = catchAsync(async (req, res) => {
  const paginationData = pickField(req.query, ["page", "limit", "sort"]);
  const filter = pickField(req.query, ["status"]);
  const result = await OrderService.getSingleCustomerAllOrder(
    req.user as JwtPayload & { role: string; userEmail: string },
    paginationData,
    filter
  );

  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    statusCode: 200,
    success: true,
    message: "Orders are fetched successfully",
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderService.getSingleOrder(id);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Orders is fetched successfully",
  });
});

const getAllOrder = catchAsync(async (req, res) => {
  const paginationData = pickField(req.query, ["page", "limit", "sort"]);
  const result = await OrderService.getAllOrder(paginationData);
  sendResponse(res, {
    meta: result.meta,
    data: result.data,
    statusCode: 200,
    success: true,
    message: "All Orders are fetched successfully",
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const result = await OrderService.updateOrder(req.params.id);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Orders is updated successfully",
  });
});

const getPendingOrder = catchAsync(async (req, res) => {
  const paginationData = pickField(req.query, ["page", "limit", "sort"]);
  const result = await OrderService.getPendingOrder(paginationData);
  sendResponse(res, {
    meta: result.meta,
    data: result.data,
    statusCode: 200,
    success: true,
    message: "Pending Orders are fetched successfully",
  });
});

const getSpeceficShopOrder = catchAsync(async (req, res) => {
  const userData = req.user;
  const paginationData = pickField(req.query, ["page", "limit", "sort"]);

  const filter = pickField(req.query, ["status"]);

  const result = await OrderService.getSpecificShopOrder(
    userData as JwtPayload & { userEmail: string; role: string },
    paginationData,
    filter
  );
  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    statusCode: 200,
    success: true,
    message: "Shop Orders are fetched successfully",
  });
});

export const OrderController = {
  orderProduct,
  getSpeceficShopOrder,
  getSingleCustomerAllOrder,
  getSingleOrder,
  getPendingOrder,
  getAllOrder,
  updateOrder,
};