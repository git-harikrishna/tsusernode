import { Request, Response, NextFunction } from "express";
import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";
import User from "../models/userSchema";
import bcrypt from "bcrypt";

async function generateAccessToken(user: any): Promise<string> {
  console.log(user);
  const accessToken: string = await jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "2m",
    }
  );

  return accessToken;
}// Function to generate accesstoken

async function generateRefreshToken(user: any): Promise<string> {
  const refreshToken: string = await jwt.sign(
    user,
    process.env.REFRESH_ACCESS_TOKEN as string,
    {
      expiresIn: "30m",
    }
  );
  return refreshToken;
}// Function to generate refersh token

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
      const user = { id: dbuser._id };

      const accessToken  : string = await generateAccessToken(user);
      const refreshToken : string = await generateRefreshToken(user);

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
  if (
    req.headers.token == null ||
    req.headers.token === "" ||
    req.headers.token == undefined
  ) {
    return res.status(401).json({ msg: "refreshToken undefined" });
  }

  console.log("token :"+req.headers.token);

  var refreshToken: string  = req.headers.token as string;
  

  try {
    jwt.verify(refreshToken,  process.env.REFRESH_ACCESS_TOKEN as string , async (err: any, user: any) => {
      if (err || user == undefined) {
        // console.log(err);
        return res.status(401).json({ msg: "Invalid refreshToken" });
      }

      // console.log(user);

      const accessToken : string = await generateAccessToken({
        id: user.id,
      });
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    console.log(err);
  }
}; // Refresh token is used to get a new access token once the old one expires
