import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    const response = await mongoose.connect(process.env.MONGODB_URI || "");
    // console.log("Mongo db connect response : ", response);
    // console.log("MongoDb connections : ", response.connections);
    // console.log("MongoDb connections[0] is : ", response.connections[0]);
    connection.isConnected = response.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("error occured while connecting to database : ", error);
    process.exit(1);
  }
}

export default dbConnect;
