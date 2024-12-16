import { config } from "../configs";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";

export const generateToken = (
    data: { userEmail: string; role: string },
    expiresIn = config.jwt_secrate_date
) => {
    const token = jwt.sign(data, config.jwt_secrate as string, {
        expiresIn: expiresIn
    });
    return token;
};


export const verifyToken = (token: string): JwtPayload => {
    try {
      const secretKey = config.jwt_secrate as string;
      if (!secretKey) {
        throw new Error("JWT secret key is not defined");
      }
      const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] }) as JwtPayload;
      return decoded;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        console.error("JWT expired at:", error.expiredAt);
        throw new ApiError(401, "Token has expired. Please login again.");
      }
  
      console.error("JWT verification error:", error.message);
      throw new ApiError(401, "Invalid or expired token");
    }
  };
      