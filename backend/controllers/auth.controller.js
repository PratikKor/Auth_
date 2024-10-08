import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {sendVerificationEmail} from "../mailtrap/emails.js";

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

    }catch(error){

    }
}

export const login = async(req,res)=>{
    res.send("Log-In");
}

export const logout = async(req,res)=>{
    res.send("Log-Out");
}
