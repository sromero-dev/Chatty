import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../model/user.model.js";

config();

const users = [
  {
    email: "pG4mW@example.com",
    fullName: "Jules",
    password: "123456",
    profilePic: "",
  },
  {
    email: "l6oOv@example.com",
    fullName: "Andrew",
    password: "123456",
    profilePic: "",
  },
  {
    email: "q4mV2@example.com",
    fullName: "Miguel",
    password: "123456",
    profilePic: "",
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await User.insertMany(users);
    console.log("DDBB seeded successfully");
  } catch (error) {
    console.log(error);
  }
};

seedData();
