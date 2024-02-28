import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details
    const { fullName, username, email, password } = req.body
    console.log("Name", fullName)
    // validations
    if (
        [fullName, username, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required! ")
    }

// check if user already exists

const existedUser = await User.findOne({
    $or: [{ username }, { email }]
})
if (existedUser) {
    throw new ApiError(409, "USer already exists with the given username/ Email")
}
// console.log(req.files);
//check for imgs and avatar  
const avatarLocalPath = req.files?.avatar[0]?.path;

// const coverImageLocalPath = req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}

if (!avatarLocalPath)
    throw new ApiError(300, "Avatar file is required!! ")
// upload them to cloudinary
const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath)


if(!avatar) 
{
    throw new ApiError(200, "Avatar not uploaded in cludinary ");
}

// create user in db
const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" 
)
if(!createdUser) {
    throw new ApiError(500, " Something went wrong while registering user")
}
return res.status(201).json(
    new ApiResponse(200,createdUser, "User registered")
)
})
export { registerUser }