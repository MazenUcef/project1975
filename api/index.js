import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose
.connect("mongodb+srv://mazenucef:mazenucef@project-estate.usg1dux.mongodb.net/project-estate?retryWrites=true&w=majority")
.then(()=>{
    console.log("connected to MongooDB");
})
.catch((err)=>{
    console.log(err);
})

const app = express();
app.listen(5000 , ()=>{
    console.log('Server is running in port 5000 ');
})


