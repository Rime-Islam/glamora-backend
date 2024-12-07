import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      status: 404,
      success: false,
      message: "Route NOT FOUND!",
    })
  };

export default notFound;