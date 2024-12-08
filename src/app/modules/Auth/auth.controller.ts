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


export const AuthController = {
    userSignin,
    forgetPassword,
    setNewPassword,

};