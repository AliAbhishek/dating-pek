import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    let conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error?.message);
    process.exit(1);
  }
};

export default connectDB;
