import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo DB connectino established")
    }catch(error){
        console.log("Error connection to MONGO_DB",error.message);
        process.exit(1);        //1 for fail ,0 for sucess 
    }
};