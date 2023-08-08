"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const authenticationRoutes_1 = __importDefault(require("./routes/authenticationRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/auth", authenticationRoutes_1.default); //authenticateRouter is for the login and refresh token route
const port = 3000;
(0, config_1.default)(); // function to initiate db connection
app.listen(port, () => {
    console.log(`Server has started at port ${port}`);
});
