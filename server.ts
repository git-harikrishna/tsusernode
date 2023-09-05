import express, { Application } from "express";
import connectDB from "./config";

import jwt from "jsonwebtoken";
import authenticateRouter from "./routes/authenticationRoutes";

const app: Application = express();

app.use(express.json());
app.use("/", authenticateRouter); //authenticateRouter is for the login and refresh token route

const port: number = 5000;

connectDB(); // function to initiate db connection

async function server() {
  app.listen(port, () => console.log(`Server Started at port : ${port}`));
}

server();

export default app;
