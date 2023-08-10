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
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema_1 = __importDefault(require("./models/userSchema")); // Import IUser from the correct path
const dotenv_1 = require("dotenv");
const bcrypt_1 = __importDefault(require("bcrypt"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, dotenv_1.config)();
        const url = process.env.dbUrl ? (_a = process.env.dbUrl) === null || _a === void 0 ? void 0 : _a.toString() : "";
        const mongooseOptions = {};
        yield mongoose_1.default.connect(url, mongooseOptions);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
    const now = new Date();
    const userDummy = [
        {
            name: "dummy1",
            mobileno: 9445582495,
            password: "password",
            emp_code: "i1",
            blood_grp: "O+ve"
        },
        {
            name: "dummy2",
            password: "password",
            mobileno: 1111111111,
            empcode: "i2",
        },
        {
            name: "dummy 3",
            password: "password",
            mobileno: 2222222222,
            emp_code: "i3",
            dob: now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear()
        },
    ];
    // dummy users are created for data population while server starting
    try {
        yield userSchema_1.default.deleteMany({});
        for (let i = 0; i < userDummy.length; i++) {
            let temp = userDummy[i].password;
            const saltPassword = yield bcrypt_1.default.genSalt(10);
            const securePassword = yield bcrypt_1.default.hash(temp, saltPassword);
            userDummy[i].password = securePassword;
        }
        yield userSchema_1.default.insertMany(userDummy);
        console.log("Dummy users inserted");
    }
    catch (error) {
        console.error("Error inserting dummy users:", error);
    }
});
// the password is hashed and stored
exports.default = connectDB;
