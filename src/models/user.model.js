import mongoose from "mongoose";
import { Video } from "./video.model";

const userSchema = new mongoose.Schema({
    watchHistory :
    {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Video"
    },
    username : 
    {
        type: String,
        required: true,
        unique : true,
        lowercase : true,
        trim: true,
        index :true
        
    },
    email : 
    {
        type: String,
        required: true,
        unique : true,
        lowercase : true,
        trim: true,
        
    },
    fullName : 
    {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar :
    {
        type: String,  //cloudnary link
        required: true,
    },
    coverimage: 
    {
        type: String,
    },
    password : 
    {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken : 
    {
        type: String
    } 
}, 
{
    timestamps : true
});

export const  User = mongoose.model("User", userSchema);