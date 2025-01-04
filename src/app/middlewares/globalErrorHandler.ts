import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import ApiError from "../errors/ApiError";


const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500; 
  let message = "Something went wrong";
  let errorDetails = err; 

  if (err instanceof ApiError) {
    // Handle custom AppError
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    statusCode = 400;
    if (err.code === "P2002") {
      // Unique constraint violation
      const fields = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(", ")
        : "field";
      message = `Duplicate value for ${fields}.`;
    } else if (err.code === "P2025") {
      // Record not found
      message = "The requested record was not found.";
    } else {
      message = "A database error occurred.";
    }
    errorDetails = {
      code: err.code,
      meta: err.meta,
    };
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    // Handle Prisma validation errors
    statusCode = 400;
    message = "Validation error occurred. Check your input.";
  } else if (err instanceof Error) {
    // Handle general JavaScript errors
    message = err.message || "Internal Server Error";
    if (process.env.NODE_ENV === "development") {
      errorDetails = { stack: err.stack };
    }
  }
  console.log(err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    err: errorDetails,
  });
};

export default errorHandler;