// Define in routes in this file

import express from "express";
import { buyCourses, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";
// import { Course } from "../models/course.model.js";

const router = express.Router();

router.post("/create",adminMiddleware,createCourse) // it will access only by admin
router.put("/update/:courseId",adminMiddleware,updateCourse); // it will access only by admin
router.delete("/delete/:courseId",adminMiddleware,deleteCourse); // it will access only by admin

router.get("/courses",getCourses);
router.get("/:courseId",courseDetails);

router.post("/buy/:courseId",userMiddleware,buyCourses);

export default router;