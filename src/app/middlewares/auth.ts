import { config } from "../configs";
import ApiError from "../errors/ApiError";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwtToken";
import { Secret } from "jsonwebtoken";

const auth = (...roles: string[]) => {
    return async (
      req: Request & { user?: any },
      res: Response,
      next: NextFunction
    ) => {
      try {
        const token = req.headers.authorization;
  
        if (!token) {
          throw new ApiError(401, "You are not authorized!");
        }
        const verifiedUser = verifyToken(
          token
        );
        req.user = verifiedUser;
  
        if (roles.length && !roles.includes(verifiedUser.role)) {
          throw new ApiError(401, "Forbidden!");
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  };
  
  export default auth;