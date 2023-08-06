import mongoose, { Document } from "mongoose";

// export interface IUser extends Document {
//   name: string;
//   mobileno: string;
//   password: string;
// }

const userSchema = new mongoose.Schema({
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
    required : true
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
