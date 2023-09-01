import mongoose, { ConnectOptions } from "mongoose";
import UserModel from "./models/userSchema"; // Import IUser from the correct path
import { config } from "dotenv";
import bcrypt from "bcrypt";

const connectDB = async (): Promise<void> => {
  try {
    config();

    const url:string = process.env.dbUrl ? process.env.dbUrl?.toString() : "";

    const mongooseOptions: ConnectOptions = {
    };

    await mongoose.connect(url, mongooseOptions);
    await UserModel.deleteMany({});
    console.log("Connected to MongoDB");

    const now: Date = new Date();

    const userDummy = [
      {
        name: "dummy1",
        mobile_no: 9445582495,
        password: "password",
        emp_code : "i1",
        blood_grp : "O+ve"
      },
      {
        name: "dummy2",
        password: "password",
        mobile_no: 1111111111,
        empcode : "i2",
      },
      {
        name: "dummy 3",
        password: "password",
        mobile_no : 2222222222,
        emp_code : "i3",
        dob : now
      },
    ];
  
    // dummy users are created for data population while server starting
    
  
    for (let i = 0; i < userDummy.length; i++) 
      {
        let temp = userDummy[i].password;
  
        const saltPassword: string = await bcrypt.genSalt(10);
        const securePassword: string = await bcrypt.hash(temp, saltPassword);
  
        userDummy[i].password = securePassword;
      }
  
      await UserModel.insertMany(userDummy);
      console.log("Dummy users inserted");


  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  // const dob = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
};

// the password is hashed and stored
}
export default connectDB;
