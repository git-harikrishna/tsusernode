"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Rest of your code...
function generateAccessToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(user);
        const accessToken = yield jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "2m",
        });
        return accessToken;
    });
} // Function to generate accesstoken
function generateRefreshToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = yield jsonwebtoken_1.default.sign(user, process.env.REFRESH_ACCESS_TOKEN, {
            expiresIn: "30m",
        });
        return refreshToken;
    });
} // Function to generate refersh token
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("addUser called");
    const temp = req.body.password;
    const saltPassword = yield bcrypt_1.default.genSalt(10);
    const securePassword = yield bcrypt_1.default.hash(temp, saltPassword);
    const user = {
        name: req.body.name,
        mobileno: req.body.mobile_no,
        password: securePassword,
        emp_code: req.body.emp_code,
        blood_grp: req.body.blood_grp,
        dob: req.body.dob,
    };
    try {
        if (req.body.name == null) {
            return res.status(400).json({ message: "User name can't be null" });
        }
        const dbuser = yield userSchema_1.default.findOne({ name: req.body.name });
        if (dbuser != null) {
            return res.status(400).json({
                message: "User name already exists. Please choose a different user name.",
            });
        }
        const newuser = yield new userSchema_1.default(user);
        yield newuser.save();
        return res.status(200).json({ msg: "User added successfully", data: newuser });
    }
    catch (e) {
        return res
            .status(500)
            .json({ error: "An error occurred while processing the request." });
    }
}); //Function to add new user
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("login called");
        const loginname = req.body.name;
        const loginpassword = req.body.password;
        const dbuser = yield userSchema_1.default.findOne({ name: loginname });
        if (!dbuser)
            return res.status(400).json({ msg: "No such username found" });
        const result = yield bcrypt_1.default.compare(loginpassword, dbuser.password);
        if (!result) {
            return res.status(401).json({ msg: "Invalid Password" });
        }
        else {
            const id = dbuser._id;
            const user = { id };
            const accessToken = yield generateAccessToken(user);
            const refreshToken = yield generateRefreshToken(user);
            res.status(200).json({
                msg: "Welcome " + dbuser.name,
                tokens: { accessToken, refreshToken },
            });
        }
    }
    catch (e) {
        console.error("Error in login:", e);
        res.status(500).json({ message: "An error occurred during login" });
    }
}); // Login function to provide access and refresh token once the user logs in
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Refresh token"+ req.headers.token);
    if (req.headers.token == null ||
        req.headers.token === "" ||
        req.headers.token == undefined) {
        return res.status(401).json({ msg: "refreshToken undefined" });
    }
    console.log("token :" + req.headers.token);
    const refreshToken = req.headers.token.toString();
    try {
        const user = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_ACCESS_TOKEN);
        // console.log("user : " + user);
        if (!user || typeof user === "string" || !user.id) {
            return res.status(401).json({ msg: "Invalid refreshToken" });
        }
        const accessToken = yield generateAccessToken({
            id: user.id,
        });
        res.status(200).json({ accessToken });
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "Invalid refreshToken" });
    }
});
exports.refreshToken = refreshToken;
// Refresh token is used to get a new access token once the old one expires
