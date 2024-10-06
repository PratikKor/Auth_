import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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
        const verificationToken =  Math.floor(1000 + Math.random() * 9000).toString();
        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpireAt:Date.now() + 24 *60 *60 *1000 // 24 hrs
        });

        await user.save();


    }catch(error){
        res.status(400).json({sucess:false,message:error.message});
        console.log("Error",error.message);
    }
}

export const login = async(req,res)=>{
    res.send("Log-In");
}

export const logout = async(req,res)=>{
    res.send("Log-Out");
}
