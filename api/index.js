import express from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
// import dotenv from 'dotenv';
// dotenv.config();

// server listen
const app = express();
app.use(express.json())
app.listen(5000 , ()=>{
    console.log('Server is running in port 5000 ');
})

// data base connection
mongoose
.connect("mongodb+srv://mazenucef:mazenucef@project-estate.usg1dux.mongodb.net/project-estate?retryWrites=true&w=majority")
.then(()=>{
    console.log("connected to MongooDB");
})
.catch((err)=>{
    console.log(err);
})
// =====================================================================

// api route
app.use("/api/user" , userRouter);
app.use("/api/auth" , authRouter);


// =============================================================
// middelware creation

app.use((err,req , res , next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Innternal server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})





