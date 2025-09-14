import { User } from "../models/user.modal.js";
import jwt from "jsonwebtoken";  // importing file 
import bcrypt from "bcryptjs";
import {z} from "zod";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

// this code for user Singnup 
export const signup = async (req,res)=>{
    const {firstName,lastName,email,password} = req.body;

    // passing data using Zob validtion
    const userSchema = z.object({
        firstName:z.string().min(2,{message:"firstName must be atleast 2 long Char"}),
        lastName:z.string().min(2,{message:"lastName must be atleast 2 long Char"}),
        email:z.string().email(), 
        password:z.string().min(8,{message:"Password must be atleast 8 long Char"}),
    })

    // whatever data is coming from req.body there it will validate
    const validateData = userSchema.safeParse(req.body);
    if(!validateData.success){
    res.status(400).json({errors:validateData.error.issues.map(err => err.message)});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    try {
        // checking the for this user in available or not 
        const existing = await User.findOne({email:email});
        if(existing){
            return res.status(400).json({errors:"User already exists"});
        }

        // if not available in database then store code
        const newUser = new User({firstName,lastName,email,password:hashedPassword});
        await newUser.save();  // save data in database
        res.status(200).json({message:"SingUp successed..",newUser});
        console.log("user signup successfully...");
    } catch (error) {
        res.status(500).json({errors:"Error in sign up"}); 
        console.log("Error in SignUp ",error);
    }
};

// this code for User login page
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password safely
    const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid password" });
    }

    // jwt code
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,  
      { expiresIn: "1d" }  // this code for expiree of token
    );

    //Cookie expirees
    const cookieOptions = {
      expires : new Date(Date.now() + 24*60*60*1000), // 1 day of validity
      httpOnly:true, // it can not accible by javaScript directly
      secure:process.env.NODE_ENV === "production",
      sameSite:"Strict" // it is proctect this attack of CSRF
    }

    // console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // passing in cookie
    res.cookie("jwt",token,cookieOptions);

    // success
    return res.status(200).json({ message: "Login Successful", user, token});

  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ errors: "Error in Login" });
  }
};
 
// this code for User Logout
export const logout = async (req,res) => {
 try {
    res.clearCookie("jwt");
    res.status(200).json({message:"Logged out successfully"});
 } catch (error) {
    res.status(500).json({errors:"Error in Logout"});
    console.log("Error in Login"); 
 }
};


export const purchases = async (req,res) => {
  const userId = req.userId;  // taking user id from userMiddleware

  try {
    const purchased = await Purchase.find({userId});

    let purchasedCourseId = []; // count of user courses how many bought
    for(let i = 0; i<purchased.length; i++){
      purchasedCourseId.push(purchased[i].courseId); // adding to courses into purchasedCourseId
       
    } 
    // taking all data course data here from databse
      const courseData = await Course.find({
        _id:{$in:purchasedCourseId}
      }) 

    res.status(200).json({purchased,courseData})
  } catch (error) {
    res.status(500).json({errors:"Error in purchasing"});
    console.log("Error in purchasing",error);
  }

};

