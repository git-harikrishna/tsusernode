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
        type: String,
        maxlength: 10,
        minlength: 10,
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
