import express, { Router } from "express";
import * as userFunctions from "../controller/userController";
import { authenticateToken } from "../middleware/authenticate";

const userRouter : Router = express.Router();

userRouter.post("/", userFunctions.addUser);
userRouter.get("/", authenticateToken, userFunctions.getUserById);
userRouter.put("/", authenticateToken, userFunctions.updateUser);
userRouter.delete("/", authenticateToken, userFunctions.default);

export default userRouter;
