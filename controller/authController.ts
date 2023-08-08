import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import { IUser } from "../types"; // Make sure this import is correct
import { ObjectId, Types } from "mongoose";

// Rest of your code...
async function generateAccessToken(user: IUser): Promise<string> {
  console.log(user);
  const accessToken: string = await jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET? process.env.ACCESS_TOKEN_SECRET.toString():"",
    {
      expiresIn: "2m",
    }
  );

  return accessToken;
} // Function to generate accesstoken

async function generateRefreshToken(user: IUser): Promise<string> {
  const refreshToken: string = await jwt.sign(
    user,
    process.env.REFRESH_ACCESS_TOKEN as string,
    {
      expiresIn: "30m",
    }
  );
  return refreshToken;
} // Function to generate refersh token

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  console.log("addUser called");

  const temp: string = req.body.password;
  const saltPassword: string = await bcrypt.genSalt(10);
  const securePassword: string = await bcrypt.hash(temp, saltPassword);

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
      return res.status(400).json({
        message:
          "User name already exists. Please choose a different user name.",
      });
    }

    const newuser = await new User(user);
    await newuser.save();
    return res.status(200).json(newuser);
  } catch (e) {
    return res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
}; //Function to add new user

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    console.log("login called");
    const loginname: string = req.body.name;
    const loginpassword: string = req.body.password;

    const dbuser = await User.findOne({ name: loginname });
    if (!dbuser) return res.status(400).json({ msg: "No such username found" });

    const result: boolean = await bcrypt.compare(
      loginpassword,
      dbuser.password
    );

    if (!result) {
      return res.status(401).json({ msg: "Invalid Password" });
    } else {
      // const id : Types.ObjectId = dbuser._id;

      const user: IUser = { id: dbuser._id };

      const accessToken: string = await generateAccessToken(user);
      const refreshToken: string = await generateRefreshToken(user);

      res.status(200).json({ accessToken, refreshToken });
    }
  } catch (e) {
    console.error("Error in login:", e);
    res.status(500).json({ message: "An error occurred during login" });
  }
}; // Login function to provide access and refresh token once the user logs in

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  // console.log("Refresh token"+ req.headers.token);
  if (
    req.headers.token == null ||
    req.headers.token === "" ||
    req.headers.token == undefined
  ) {
    return res.status(401).json({ msg: "refreshToken undefined" });
  }

  console.log("token :" + req.headers.token);

  const refreshToken: string = req.headers.token.toString();

  try {
    const user = jwt.verify(
      refreshToken,
      process.env.REFRESH_ACCESS_TOKEN
        ? process.env.REFRESH_ACCESS_TOKEN?.toString()
        : ""
    ) as JwtPayload;

    if (!user || !user.id) {
      return res.status(401).json({ msg: "Invalid refreshToken" });
    }

    const accessToken: string = await generateAccessToken({
      id: user.id,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Invalid refreshToken" });
  }
};
// Refresh token is used to get a new access token once the old one expires
