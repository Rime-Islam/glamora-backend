import { config } from "../configs";
import jwt, { JwtPayload } from "jsonwebtoken";
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
    const decord = jwt.verify(
        token,
        config.jwt_secrate as string
    ) as JwtPayload;
    return decord;
} catch (error) {
    throw new ApiError(401, "Invalid/Expired token");
}
};