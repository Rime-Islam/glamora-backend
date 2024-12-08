import catchAsync from "../../utils/catchAsync";
import { pickField } from "../../utils/pickFields";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";


const createUser = catchAsync(async (req, res) => {
    const result = await userService.createUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User created successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req, res) => {
    const paginationData = pickField(req.query, ["page", "limit", "sort"]);
    const filter = pickField(req.query, ["searchTerm", "isBlocked"]);
  
    const result = await userService.getAllUsers(paginationData, filter);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All users are fetched successfully",
      data: result.data,
      meta: result.meta,
    });
});

const blockedUser = catchAsync(async (req, res) => {
    const result = await userService.userBlocked(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User Status Changed",
      data: result,
    });
});

const deleteUser = catchAsync(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User delete status Changed",
      data: result,
    });
});


export const UserController = {
    createUser,
    getAllUsers,
    blockedUser,
    deleteUser,
};