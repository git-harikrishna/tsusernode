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
exports.updateUser = exports.getUserById = exports.addUser = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("addUser called");
    const temp = req.body.password;
    const saltPassword = yield bcrypt_1.default.genSalt(10);
    const securePassword = yield bcrypt_1.default.hash(temp, saltPassword);
    const user = {
        name: req.body.name,
        mobileno: req.body.mobileno,
        password: securePassword,
    };
    try {
        if (req.body.name == null) {
            return res.status(400).json({ message: "User name can't be null" });
        }
        const dbuser = yield userSchema_1.default.findOne({ name: req.body.name });
        if (dbuser != null) {
            return res.status(400).json({ message: "User name already exists. Please choose a different user name." });
        }
        const newuser = yield new userSchema_1.default(user);
        yield newuser.save();
        return res.status(200).json(newuser);
    }
    catch (e) {
        return res.status(500).json({ error: "An error occurred while processing the request." });
    }
}); //Function to add new user
exports.addUser = addUser;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getUserById called");
    try {
        const id = req.user.id;
        const user = yield userSchema_1.default.findById(id);
        if (user == null) {
            return res.status(400).json({ message: "no user found" });
        }
        return res.json(user);
    }
    catch (e) {
        return res.status(500).json({ error: "An error occurred while processing the request." });
    }
}); // Function to get a particular user details using accesstoken
exports.getUserById = getUserById;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("updateUser called");
    const id = req.user.id;
    try {
        const user = yield userSchema_1.default.findById(id);
        if (user == null) {
            return res
                .status(400)
                .json({ message: "no user found" });
        }
        user.name = req.body.name;
        user.mobileno = req.body.mobileno;
        yield user.save();
        return res.status(200).json(user);
    }
    catch (e) {
        return res.status(500).send("Error: " + e);
    }
}); // Function to update user details
exports.updateUser = updateUser;
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("deleteUser called");
    try {
        const user = yield userSchema_1.default.findByIdAndRemove(req.user.id);
        if (user == null) {
            return res
                .status(400)
                .json({ message: "no user found with the given id" });
        }
        return res.status(200).send("User Deleted");
    }
    catch (e) {
        return res.status(500).send("Error: " + e);
    }
}); //  Function to delete user details
