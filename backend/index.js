import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";

import createRoute from "./routes/course.route.js"
import userRoute from "./routes/user.route.js"
import adminRoute from "./routes/admin.route.js"
import orderRoute from "./routes/order.route.js"

import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors";

// importing cloudinary 
import {v2 as cloudinary} from 'cloudinary';
dotenv.config();



const app = express();
dotenv.config();

// middleware to parseing into json format
app.use(express.json());
app.use(cookieParser());

// Express file upload code
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true, // it is for cookies and storage
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

// Accessing Port number from .env file
const port = process.env.PORT || 3000;

//Accessing MongoDB from .env file
const DB_URI = process.env.MONGO_URI;

// checking database is working or not
try {
    await mongoose.connect(DB_URI);
    console.log(`Conected to MongoDB`);
} catch (error) {
    console.log(error);
}

// Defining routes
app.use("/course",createRoute);
app.use("/user",userRoute);
app.use("/admin",adminRoute);
app.use("/order",orderRoute);



// Configuration cloudinary
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server in running on port ${port}`)
})