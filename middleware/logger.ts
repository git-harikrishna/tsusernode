import { Request, Response, NextFunction } from "express";

const methodLogger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`Request: ${req.method} - ${req.url}`);
  next();
};

export default methodLogger;
