import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        // console.log(accessToken, refreshToken);

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken }
    }
    catch (err) {
        // throw new ApiError(500, "Something went wrong while generating tokens ")
        console.log(err)
    }
}

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


    if (!avatar) {
        throw new ApiError(200, "Avatar not uploaded in cludinary ");
    }

    // create user in db
    const user = await User.create(
        {
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, " Something went wrong while registering user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered")
    )
})


const loginUser = asyncHandler(async (req, res) => {

    //   get userid and password from user
    const { email, username, password } = req.body
    if (!(username || email))
        throw new ApiError(400, "Username or email required")

    // check if user exists
    const user = await User.findOne(
        {
            $or: [{ username }, { email }]
        })
    if (!user) {
        throw new ApiError(404, "No user with given name/ email. Register first!")
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    // if password correct generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // send token in cookie
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   const options = {
    htttpOnly: true,
    secure: true
   }
   return res.status(200)
   .cookie("accessToken" , accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse(200, 
        {
            user: loggedInUser, accessToken, refreshToken
        }, "User logged in successfully")
   )
})

const logoutUser = asyncHandler (async(req,res)=>{

    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set : 
            {
                refreshToken: undefined
            }
        }, 
        {
            new : true
        }
    )
    const options = {
        htttpOnly: true,
        secure : true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})
export { registerUser, loginUser, logoutUser }