import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils.js";
function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState();

  //token
  useEffect(() => {
    const token = localStorage.getItem("user");
    // checking user is logged in or not
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in loggin out", error);
      toast.error("Error in Logging out");
    }
  };

  // fetchCorses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });

        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("Error in Corse fetching", error);
      }
    };
    fetchCourses();
  }, []);

  //  Detect viewport width
  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width >= 1280) setSlidesToShow(4);
      else if (width >= 1024) setSlidesToShow(3);
      else if (width >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
    };

    updateSlides(); // run on mount
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold hidden sm:block ">
              CourseAcademy
            </h1>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main section  */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-semibold text-orange-500">
            CourseAcademy
          </h1>
          <br />
          <p className="text-gray-500">Build Your Dream with Us</p>
          <div className="space-x-5 mt-6">
            <Link
              to={"/courses"}
              className="bg-green-500 text-black rounded font-semibold hover:bg-white duration-300 hover:text-black py-2 px-3"
            >
              ExploreCourse
            </Link>
            <Link
              to={""}
              className="bg-white text-black rounded font-semibold hover:bg-green-500 duration-300 hover:text-black py-2 px-3"
            >
              CourseVideo
            </Link>
          </div>
        </section>

        {/* Slider */}
        <section>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-3">
                <div className="rounded-2xl relative flex-shrink-0 h-60 transition-transform duration-300 transform hover:scale-105 bg-gray-900 ">
                  <div className="overflow-hidden">
                    <img
                      className="h-25 items-center w-full object-contain"
                      src={course.image.url}
                      alt={course.title}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-xl mb-8 font-bold text-white">
                      {course.title}
                    </h2>
                    <Link
                      to={`/courses`}
                      className="mt-4 bg-orange-500 text-white py-3 px-5 rounded-3xl hover:bg-blue-500 duration-300 cursor-pointer"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />

        {/* Footer  */}
        <footer className="my-8 text-white px-6 py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {/* Logo & Socials */}
            <div className="flex flex-col items-start md:items-center text-left md:text-left">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  CourseAcademy
                </h1>
              </div>
              <div className="mt-4">
                <p className="mb-2 font-semibold">Follow Us</p>
                <div className="flex space-x-4 justify-end md:justify-start">
                  <a href="">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                </div>
                <div className="mt-4">
                  <Link
                    to=""
                    className="bg-orange-500 px-8 py-2 rounded-lg hover:bg-orange-600 duration-300"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </div>

            {/* Connects */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center">
              <h3 className="text-lg mb-4 font-semibold">Connects</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="hover:text-white cursor-pointer duration-300">
                  YouTube
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Telegram
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Github
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center">
              <h3 className="text-lg mb-4 font-semibold">Copyright © 2025</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
