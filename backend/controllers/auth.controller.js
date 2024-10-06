import { User } from "../models/user.model.js";

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
