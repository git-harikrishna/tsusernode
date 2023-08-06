import express, { Application } from "express";
import userRouter from "./routes/user";
import methodLogger from "./middleware/logger";
import connectDB from "./config";

import jwt from "jsonwebtoken";
import authenticateRouter from "./routes/authenticationRoutes";

const app: Application = express();

app.use(express.json());
app.use(methodLogger);
app.use("/auth", authenticateRouter); //authenticateRouter is for the login and refresh token route 
app.use("/user", userRouter);  // for user control routes

const port: number = 3000;

connectDB(); // function to initiate db connection

app.listen(port, () => {
  console.log(`Server has started at port ${port}`);
});
