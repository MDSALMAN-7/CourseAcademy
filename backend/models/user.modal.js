// Here we write database schema

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        union:true
    },
    password:{
        type:String,
        require:true
    }
   
});

export const User = mongoose.model('User',userSchema)