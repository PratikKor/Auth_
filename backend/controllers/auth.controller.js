import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {sendPasswordResetEmail, sendResetSucessEmail, sendVerificationEmail, sendWelcomeEmail} from "../mailtrap/emails.js";

export const signup = async(req,res)=>{
    const {email,password,name} = req.body;

    try{
        if(!email || !password || !name){
            throw new Error("All fields required");
        }

        const userAlreadyExists =  await User.findOne({email});

        if (userAlreadyExists){
            return res.status(400).json({sucess:false,message:"User Already Exists"});
        }

        const hashedPassword = await bcryptjs.hash(password,10);
        const verificationToken =  Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpireAt:Date.now() + 24 *60 *60 *1000 // 24 hrs
        });

        await user.save();

        generateTokenAndSetCookie(res,user._id);

        await sendVerificationEmail(user.email,verificationToken);

        res.status(201).json({
            sucess:true,
            message:"User created Sucessfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        })

    }catch(error){
        res.status(400).json({sucess:false,message:error.message});
        console.log("Error",error.message);
    }
}

export const verifyEmail = async(req,res) =>{
    const {code} = req.body;
    try{
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpireAt:{$gt:Date.now()}
        })

        if(!user){
            return res.status(400).json({sucess:false,message:"Invalid or expired Code"})
        }

        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpireAt=undefined;

        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({
            sucess:true,
            message:"Email verified Sucessfully",
            user: {
                ...user._doc,
                password:undefined,
            }
        });
    }catch(error){
        console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async(req,res)=>{
    const {email,password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({sucess:false,message:"Invalid Credientials"});
        }
        const isPasswordValid = await bcryptjs.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({sucess:false,message:"Invalid Credientials"});
        }

        generateTokenAndSetCookie(res,user._id);

        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({
            sucess:true,
            message:`User Logged in sucessfully, ${user.name}`,
            user:{
                ...user._doc,
                password:undefined,
            },
        });

    }catch(error){
        console.log("error in login,",error);
        res.status(400).json({
            sucess:false,
            message:error.message
        });
    }
};

export const logout = async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({sucess:true,message:"Logged out Sucessfully!"});
}

export const forgotPassword = async(req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({sucess:false,message:"User not Found"}); 
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000;

        user.resetPasswordToken  = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({sucess:true,message:"Password reset link sent "});
    }catch(error){
        console.log("Error in forgotPassword",error);
        res.status(400).json({sucess:false, message: error.message });
    }
};

export const resetPassword = async(req,res)=>{
    try{
        const {token} = req.params;
        const {password} = req.body;
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()},
        })

        if(!user){
            res.status(400).json({sucess:false,message:"Password reset token expire"});
        }
            
        const hashedPassword = await bcryptjs.hash(password,10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSucessEmail(user.email);

        res.status(200).json({sucess:true,message:"Password reset Sucessfull"});
        // maybe error in follwoing User.name
        console.log(`Password Reset sucessful for user ${User.name}`)

    }catch(error){
        console.log("Error in resettPassword",error);
        res.status(400).json({sucess:false,message:error.message});
    }
}

export const checkAuth = async(req,res)=>{
    
    try{
        const user = await User.findById(req.userId)
        if(!user){
            return res.status(400).json({sucess:false,message:"user not found"});
        }

        res.status(200).json({
            sucess:true,
            user:{ ...user._doc,
            password:undefined }
        });
    }catch(error){
        console.log("Error in Check Auth",error);
        res.status(400).json({sucess:false,message:error.message});
    }
}
