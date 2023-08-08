import { AnyObject } from "mongoose";
import { IUser } from "./types";

declare namespace Express {
    interface Request {
      user: IUser;
    }
  }


  // The following code has been written to enable req.user 
  