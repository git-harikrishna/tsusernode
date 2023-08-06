import { Request, Response, NextFunction } from "express";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const addUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  console.log("addUser called");

  const temp : string = req.body.password as string;
  const saltPassword : string = await bcrypt.genSalt(10);
  const securePassword : string = await bcrypt.hash(temp, saltPassword);

  const user = {
    name: req.body.name,
    mobileno: req.body.mobileno,
    password: securePassword,
  };

  try {
    if (req.body.name == null) {
      return res.status(400).json({ message: "User name can't be null" });
    }

    const dbuser = await User.findOne({ name: req.body.name });
    if (dbuser != null) {
      return res.status(400).json({ message: "User name already exists. Please choose a different user name." });
    }

    const newuser = await new User(user);
    await newuser.save();
    return res.status(200).json(newuser);
  } catch (e) {
    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
};//Function to add new user

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  console.log("getUserById called");
  try {
    const id : number = req.user.id;
    const user = await User.findById(id);

    if (user == null) {
      return res.status(400).json({ message: "no user found" });
    }
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
};// Function to get a particular user details using accesstoken

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  console.log("updateUser called");

  const id : number = req.user.id;

  try {
    const user = await User.findById(id);

    if (user == null) {
      return res
        .status(400)
        .json({ message: "no user found" });
    }

    user.name = req.body.name as string;
    user.mobileno = req.body.mobileno as string;

    await user.save();

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).send("Error: " + e);
  }
};// Function to update user details

export default async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  console.log("deleteUser called");

  try {
    const user = await User.findByIdAndRemove(req.user.id);

    if (user == null) {
      return res
        .status(400)
        .json({ message: "no user found with the given id" });
    }

    return res.status(200).send("User Deleted");
  } catch (e) {
    return res.status(500).send("Error: " + e);
  }
};//  Function to delete user details
