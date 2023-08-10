import mongoose from "mongoose";

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
    type: Number,
    required : true,
  },
  password: {
    type: String,
    minlength: 8,
    required : true
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

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
