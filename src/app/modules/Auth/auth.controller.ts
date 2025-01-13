import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";



const userSignin = catchAsync(async (req, res) => {
   
  const result = await AuthService.userSignin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Login successfull",
      data: result,
    });
  });

  const forgetPassword = catchAsync(async (req, res) => {
    const userEmail = req.body.email;
  
    const result = await AuthService.forgetPassword(userEmail);
  
    sendResponse(res, {
      data: { token: result },
      statusCode: 200,
      success: true,
      message: "Password reset link sent to your email",
    });
  });


const setNewPassword = catchAsync(async (req, res) => {
    const data = req.body;
console.log(data)
    const result = await AuthService.setUserNewPassword(
      data?.token,
      data?.password
    );

    sendResponse(res, {
      data: result,
      statusCode: 200,
      success: true,
      message: "Password Updated Successfully",
    });
});

const getUserDashboard = catchAsync(async (req, res) => {
  const userData = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await AuthService.getUserDashboard(userData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetch successfully",
    data: result,
  });
});

const getAdminDashboard = catchAsync(async (req, res) => {

  const userData = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await AuthService.getAdminDashboard(userData);

  console.log(result);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetch successfully",
    data: result,
  });
});

const getVendorDashboard = catchAsync(async (req, res) => {
  const userData = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await AuthService.getVendorDashboard(userData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetch successfully",
    data: result,
  });
});



export const AuthController = {
    userSignin,
    forgetPassword,
    setNewPassword,
    getUserDashboard,
    getAdminDashboard,
    getVendorDashboard,

};