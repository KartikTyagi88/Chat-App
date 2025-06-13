import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //Creating a new user:
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            //Generate JWT token:
            generateToken(newUser._id , res);
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else{
            res.status(400).json({message: "Invalid User data"});
        }
        
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({message: "Internal Server Error"})
        
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({message: "Internal server error"});
        
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const updateProfile = async (req,res) =>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id    //We can access user from the req because we inserted it in the middleware protectRoute before calling this function.

        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);            //Uploading the pic to cloudinary.
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});      // Finding the user in the database and update its profilePic

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile:", error.message);
        res.status(500).json({message: "Internal server error"});
        
    }
}

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({message: "Internal server error"});
        
    }
}