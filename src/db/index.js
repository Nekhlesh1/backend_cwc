import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try
    {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);

       console.log(`\n Mongo connected to host : ${connectionInstance.connection.host}`);

    }
    catch(error) {
        console.log("Err coneecting to db", error);
        process.exit(1)
    }
};

export default connectDB;