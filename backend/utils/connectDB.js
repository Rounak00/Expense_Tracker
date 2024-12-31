import mongoose from 'mongoose';
import { secret } from '../config/secrets.js';
export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(secret.DB_URL);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    }catch(err){
        console.log("Error in MongoDB Connection", err);
    }
}