import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGO DB Connected! ${conn.connection.host}`);
        
    } catch (error) {
        console.log("MONGO DB connection error: ", error);
        
    }
};