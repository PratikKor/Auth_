import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.routes.js"


dotenv.config(); 


const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);

app.listen(port,()=>{
    connectDB();
    console.log("Listening to port 3000");
});

