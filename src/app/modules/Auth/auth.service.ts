import ApiError from "../../errors/ApiError";
import { generateToken, verifyToken } from "../../utils/jwtToken";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { resetPasswordEmail } from "../../utils/sendEmail";
import { config } from "../../configs";
import { Secret } from "jsonwebtoken";


const userSignin = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
  
    if (!user) {
      throw new ApiError(404, "User not find");
    }
  
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new ApiError(404, "Invalid password");
    }
  
    const token = generateToken({ userEmail: user.email, role: user.role });
  
    if (!token) {
      throw new ApiError(404, "Something Went Wrong!! Try again.");
    }
  
    return { token };
};
  
const forgetPassword = async (userEmail: string) => {
    const findUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    const name = findUser?.name as string;
    const email = userEmail;

    if (!findUser) {
      throw new ApiError(500, "User not found");
    }
  
    const accessToken = generateToken(
      {
        userEmail: userEmail,
        role: "",
      },
      "5min"
    );
    const token = `${accessToken}`;

      const url = config.URL;
      const URL = `${url}/reset_password?email=${userEmail}&token=${token}`;
   
    await resetPasswordEmail(email, URL, name);
  
    return "";
};

const setUserNewPassword = async (token: string, password: string) => {
    const decoded = verifyToken(token, config.jwt_secrate as Secret);
  
    const isUserExist = await prisma.user.findUnique({
      where: { email: decoded.userEmail },
    });
  
    if (!isUserExist) {
      throw new ApiError(404, "User not Found");
    }
    const hashedPassword = await bcrypt.hash(password, Number(config.saltRounds));
  
    const result = await prisma.user.update({
      where: { email: decoded.userEmail },
      data: { password: hashedPassword },
    });
    return result;
  };


export const AuthService = {
    userSignin,
    forgetPassword,
    setUserNewPassword,

}