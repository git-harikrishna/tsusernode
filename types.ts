import { Types } from "mongoose";

export interface IUser {
  id: Types.ObjectId | string;
}
export interface db_User {
  id?: Types.ObjectId;
  name: string;
  email: string;
  mobile_no: Number;
  password: string;
  emp_code: Number;
  dob?: Date;
}
