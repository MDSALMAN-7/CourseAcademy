// Here we write database schema

import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    image:{
        public_id:{
            type:String,
            require:true
        },
        url:{
            type:String,
            require:true
        }
    },
    price:{
        type:Number,
        require:true
    },
    creatorId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }

});

export const Course = mongoose.model('Course',courseSchema)