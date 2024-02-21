// require('dotenv').config()
import dotenv from 'dotenv'
import connectDB from './db/index.js';
import app from './app.js'

dotenv.config({
    path: './env'
});
connectDB().
then(()=> {
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`Successfully connected to server on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("Mongo db connection failed!!",err)
})

























// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express"
// const app = express();

// (async ()=>{

//     try {
//         mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("ERRRRR", error);
//             throw error
//         })

//         app.listen(process.env.PORT,()=> {
//             console.log("Listening on port",process.env.PORT);
//         })
        
//     }
//     catch(error) {
//         console.error("ERROR :", error)
//         throw error

//     }
// })()