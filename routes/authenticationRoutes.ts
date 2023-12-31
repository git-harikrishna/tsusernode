import express, { Router } from "express";
import * as authFunctions from "../controller/authController";

const authenticateRouter : Router = express.Router();

authenticateRouter.post("/login", authFunctions.login);
authenticateRouter.get("/refreshToken", authFunctions.refreshToken);

export default authenticateRouter;
