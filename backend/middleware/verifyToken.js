import jwt, { decode } from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({sucess:false,message:"Unauthorized no token provided"});
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({sucess:false,message:"Unauthorized"});
        req.userId = decoded.userId;
        next();
    }catch(error){
        console.log(`Error ${error}`);
        res.status(401).json({sucess:false,message:"Error in verifyToken"});
    }
}