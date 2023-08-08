import mongoose, { ConnectOptions } from "mongoose";
import UserModel from "./models/userSchema"; // Import IUser from the correct path
import { config } from "dotenv";
import bcrypt from "bcrypt";

const connectDB = async (): Promise<void> => {
  try {
    config();

    const url = process.env.dbUrl as string;

    const mongooseOptions: ConnectOptions = {
      useUnifiedTopology: true,
    } as ConnectOptions;

    await mongoose.connect(url, mongooseOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }

  const userDummy = [
    {
      name: "dummy1",
      mobileno: "9445582495",
      password: "password",
    },
    {
      name: "dummy2",
      password: "password",
    },
    {
      name: "dummy 3",
      password: "password",
    },
  ];

  // dummy users are created for data population while server starting

  try {
    await UserModel.deleteMany({});

    for (let i = 0; i < userDummy.length; i++) {
      let temp = userDummy[i].password;

      const saltPassword : string = await bcrypt.genSalt(10);
      const securePassword : string  = await bcrypt.hash(temp, saltPassword);

      userDummy[i].password = securePassword;
    }

    await UserModel.insertMany(userDummy);
    console.log("Dummy users inserted");
  } catch (error) {
    console.error("Error inserting dummy users:", error);
  }
};


// the password is hashed and stored 

export default connectDB;
