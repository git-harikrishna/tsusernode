import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import { IUser, db_User } from "../types"; // Make sure this import is correct
import { Types } from "mongoose";

// Rest of your code...
async function generateAccessToken(user: IUser): Promise<string> {
  console.log(user);
  const accessToken: string = await jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "2m",
    }
  );

  return accessToken;
} // Function to generate accesstoken

async function generateRefreshToken(user: IUser): Promise<string> {
  const refreshToken: string = await jwt.sign(
    user,
    process.env.REFRESH_ACCESS_TOKEN!,
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

  const user: db_User = {
    name: req.body.name,
    mobile_no: req.body.mobile_no,
    email: req.body.email,
    password: securePassword,
    emp_code: req.body.emp_code,
  };

  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "User name can't be null" });
    }

    const dbuser: db_User | null = await User.findOne({ name: req.body.name });
    if (dbuser) {
      return res
        .status(400)
        .json({ message: "User name already exists." });
    }

    console.log("Checkpoint 1");

    const newuser = new User(user);

    console.log("Checkpoint 2: " + newuser);

    await newuser.save();

    console.log("Checkpoint 3");

    return res
      .status(200)
      .json({ msg: "User added successfully", data: newuser });
  } catch (e) {
    console.error("Error in signUp:", e);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

// Other code remains the same...
//Function to add new user

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
      const id: Types.ObjectId = dbuser._id;

      const user: IUser = { id };

      const accessToken: string = await generateAccessToken(user);
      const refreshToken: string = await generateRefreshToken(user);

      res.status(200).json({
        msg: "Welcome " + dbuser.name,
        tokens: { accessToken, refreshToken },
      });
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
    const user: string | JwtPayload = jwt.verify(
      refreshToken,
      process.env.REFRESH_ACCESS_TOKEN!
    );

    // console.log("user : " + user);

    if (!user || typeof user === "string" || !user.id) {
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
