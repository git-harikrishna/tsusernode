import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>=> {
  const authHeader : string | undefined = req.headers["authorization"];
  const token : string | undefined= authHeader && authHeader.split(" ")[1];
  
  if (token == null || token == undefined)  return res.status(401).json({message : " token is null or undefined "});

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({err});
    req.user = user;
    next();
  });
};
