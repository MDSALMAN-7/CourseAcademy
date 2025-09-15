// Bussiness logic

import {Course} from "../models/course.model.js";
import {v2 as cloudinary} from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


// this is course create
export const createCourse = async (req,res) =>{ 
    const adminId = req.adminId;
    // const title = req.body.title;
    // const description = req.body.description;
    // const image = req.body.image;
    // const price = req.body.price;    

    //insted of this here using i am destructring method
    const {title,description,price}=req.body;
    console.log(title,description,price);

    try {
        if(!title||!description||!price){
            return res.status(400).json({errors:"All fields are require"});
        }

        // storing image using file
        const {image}=req.files;
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({errors:"NO file uploaded"});
        }

        // now checking format of image
        const allowedFormat = ["image/png","image/jpeg"];
        if(!allowedFormat.includes(image.mimetype)){ 
            return res.status(400).json({errors:"Invalid file format, Only PNG and JPG format allowed"});
        }

        // cloudinary code for image fo
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
        if(!cloud_response || cloud_response.error){
            return res.status(400).json({errors:"error uploading file to cloudinary"});
        }

        const courseData = {
            title,
            description,
            price,
            image:{
                // we store this two data
                public_id:cloud_response.public_id,
                url:cloud_response.url,
            },
            creatorId:adminId
        }

        // now store this data into database 
        const course = await Course.create(courseData);
        res.json({
            message:"Course created successfully",
            course
        })
        console.log("Course created successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({errors:"Error Creating course"});
    }

};

// this is For CourseUpdate
// export const updateCourse = async(req,res)=>{

//     const adminId = req.adminId;

//     const {courseId} = req.params;
//     const {title,description,price,image} = req.body;
//     try {
//         const course = await Course.updateOne({
//             _id:courseId,
//             creatorId:adminId
//         },{
//            title,
//            description,
//            price,
//            image:{
//             public_id:image?.public_id,
//             url:image?.url,
//            } 
//         })
//         res.status(201).json({message:"course updated successfully"});
//     } catch (error) {
//         res.status(500).json({errors:"error in course updating"});
//         console.log("Error in course update",error);
//     }
// };


//2.updating courses
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body; // ✅ only text comes in body

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    let imageData = courseSearch.image; // keep old image if no new one(take image)

    //  handle new image if uploaded
    if (req.files && req.files.image) {
      const file = req.files.image;

      // upload to cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "courses",
      });

      imageData = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    

    const course = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      { title, description, price, image: imageData }, // image data store in imageData
    );

      if (!course) {
      return res.status(404).json({ errors: "can't update, created by other admin" });
    }
    res.status(200).json({ message: "Course updated successfully", course: course });

  } catch (error) {
    res.status(500).json({ errors: "Error in course updating" });
    console.log("error in course updated", error);
  }
};

// this is For DeleteCourse
export const deleteCourse = async (req,res)=>{

    const adminId = req.adminId

    const {courseId} = req.params;
    try {
        const course = await Course.findOneAndDelete({
            _id:courseId,
            creatorId:adminId
        })
        if(!course){ // course is not there then this error will come
            return res.status(400).json({error:"Course is not found"});
        }else{
            return res.status(200).json({massage:"Course is Deleted..."})
        }
    } catch (error) {
        res.status(400).json({errors:"Error in Course deleting"});
        console.log("error in course deleting",error);
    }
}; 

// this code is for AllCourses
export const getCourses = async (req,res)=>{
    try {
        const courses = await Course.find({})
        res.json({courses})
        console.log("Get all Courses")
    } catch (error) {
        res.status(500).json({errors:"Error in geting courses"});
        console.log("Error to get Courses",error)
    }
};

// this code is for taget "particular course"
export const courseDetails = async (req,res)=>{
    const {courseId} = req.params;
    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({error:"Course in not found"});
        }
        res.status(200).json({course}); // return all courses
    } catch (error) {
        res.status(500).json({errors:"Error in getting Course Details"});
        console.log("Error in Course Details",error);
    }
}

//Stirpe 
import Stripe from "stripe"  // importing stripe file
import config from "../config.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY)
console.log(config.STRIPE_SECRET_KEY);

// Buy Courses
export const buyCourses = async (req,res)=>{
    const {userId} = req;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({error:"course not found"});
        }

        const existingPurchase = await Purchase.findOne({userId,courseId});
        if (existingPurchase) {
        return res
            .status(400)
            .json({ errors: "User has already purchased this course" });
        }


        // Strip method we use for payment !!
        const amount = course.price;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types:["card"]
        });


        
        res.status(201).json({
            message:"Course purchased successFully...",
            // newPurchase,
            clientSecret: paymentIntent.client_secret,  // intrect with frontend
            course, // receing price from course where price in implement
        });
        
    } catch (error) {
        res.status(500).json({error: "Course not Found"});
        console.log("error in course buying",error);
    }
};