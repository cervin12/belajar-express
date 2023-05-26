import mongoose from "mongoose";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const connection = () => {
  mongoose.connect("mongodb://localhost:27017", {
    dbName: env.MONGODB_NAME,
  });
  const conn = mongoose.connection;

  conn.on("error", console.error.bind(console, "Connection error :"));
  conn.once("open", () => {
    console.log("Connect to mongodb");
  });
};

export default connection
