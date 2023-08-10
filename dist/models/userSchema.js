"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// export interface IUser extends Document {
//   name: string;
//   mobileno: string;
//   password: string;
// }
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileno: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    emp_code: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    dob: {
        type: Date,
        require: false,
    },
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
