import mongoose from "mongoose";
import { User } from "./user.model";
const videoSchema = new mongoose.Schema({
    videoFile : {},
    thumnail: {},
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : User
    },
    title : {},
    description: {},
    duration : {}
},
{
    timestamps: true
});
export const Video = mongoose.model("Video", videoSchema);