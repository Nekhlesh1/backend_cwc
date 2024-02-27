import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req,res) => {
    // get user details
    const {fullName, username, email, password} = req.body
    console.log("NAme" ,fullName)
    // validations

    // check if user already exists
    
    //check for imgs and avatar 
}) 

export {registerUser}