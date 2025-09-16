import React, { useEffect, useState } from 'react'
import logo from '../../public/logo.webp'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';
function Home() {
    const [courses,setCourses] = useState([]);
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    //token
    useEffect(()=>{
        const token = localStorage.getItem("user");
        // checking user is logged in or not
        if(token){
            setIsLoggedIn(true);
        }else{
            setIsLoggedIn(false);
        }
    },[])

    // logout
    const handleLogout = async()=>{
        try {
            const response = await axios.get(`${BACKEND_URL}/user/logout`,{
                withCredentials:true,
            })
            toast.success(response.data.message);
            localStorage.removeItem("user");
            setIsLoggedIn(false);
        } catch (error) {
            console.log("Error in loggin out",error);
            toast.error("Error in Logging out")
        }
    }

    // fetchCorses
    useEffect(()=>{
        const fetchCourses = async ()=>{
            try {
                const response = await axios.get(`${BACKEND_URL}/course/courses`,{
                    withCredentials:true
                })

                console.log(response.data.courses);
                setCourses(response.data.courses);
            } catch (error) {
                console.log("Error in Corse fetching",error);
            }
        };
        fetchCourses();
    },[]);

    var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
        <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">
            {/* Header */}
            <header className='flex items-center justify-between p-6'>
                <div className='flex items-center space-x-2'>
                    <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                    <h1 className='text-2xl text-orange-500 font-bold '>CourseAcademy</h1>
                </div>
                <div className='space-x-4'>
                    {isLoggedIn ? (
                        <button  onClick={handleLogout}
                        className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded">
                            Logout
                        </button>
                    ) : (<>
                        <Link to={"/login"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Login</Link>
                        <Link to={"/signup"} className='bg-transparent text-white py-2 px-4 border border-white rounded' >Signup</Link>
                    </>)}
                </div> 
            </header>
 
            {/* Main section  */} 
            <section className='text-center py-20'>
                <h1 className='text-4xl font-semibold text-orange-500'>CourseAcademy</h1>
                <br />
                <p className='text-gray-500'>Build Your Dream with Us</p>
                <div className='space-x-5 mt-6'> 
                    <Link to={"/courses"} className='bg-green-500 text-black rounded font-semibold hover:bg-white duration-300 hover:text-black py-2 px-3'>ExploreCourse</Link>
                    <Link to={""} className='bg-white text-black rounded font-semibold hover:bg-green-500 duration-300 hover:text-black py-2 px-3'>CourseVideo</Link>
                </div>
            </section> 

            <section>
                <Slider {...settings}>
                    {/* creating card */}
                    {courses.map((course)=>(
                        <div key={course._id} className='p-4'>
                            <div className='relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105'>
                                <div className='bg-gray-900 rounded-lg overflow-hidden'>
                                    <img className='h-32 w-full object-contain' src={course.image.url} alt="" />
                                    <div className='p-6 text-center'>
                                        <h2 className='text-xl font-bold text-white'>{course.title }</h2>
                                        <button className='mt-4 bg-orange-400 text-white px-4 py-2 rounded-full duration-300 hover:bg-blue-500'>Enroll now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            <hr />

            {/* Footer  */}
            <footer className='my-8'>
                <div className='grid grid-cols-1 md:grid-cols-3'>
                    <div className='flex flex-col items-center md:items-start'>
                        <div className='flex items-center space-x-2'>
                            <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                            <h1 className='text-2xl text-orange-500 font-bold '>CourseAcademy</h1>
                        </div>
                        <div className='mt-4 ml-2 md:ml-8 '>
                            <p className='mb-2'>Follow Us</p>
                            <div className='flex space-x-4'>
                                <a href=""><FaFacebook className='text-2xl hover:text-blue-400 duration-300' /></a>
                                <a href=""><FaInstagram  className='text-2xl hover:text-pink-600 duration-300' /></a>
                                <a href=""><FaTwitter  className='text-2xl hover:text-blue-600 duration-300'/></a>
                            </div>
                        </div>
                    </div>

                    <div className='items-center flex flex-col'>
                        <h3 className='text-lg mb-4 semi-bold'>Connects</h3>
                        <ul className='text-gray-400 space-y-2'>
                            <li className='hover:text-white cursor-pointer duration-300'>youtube</li>
                            <li className='hover:text-white duration-300 cursor-pointer'>telegram</li>
                            <li className='hover:text-white cursor-pointer duration-300'>Github</li>
                        </ul>
                    </div>

                    <div className='items-center flex flex-col'>
                        <h3 className='text-lg mb-4 semi-bold'>Copyright © 2025</h3>
                        <ul className='text-gray-400 space-y-2'>
                            <li className='hover:text-white cursor-pointer duration-300'>Terms & Conditions</li>
                            <li className='hover:text-white duration-300 cursor-pointer'>Privacy Policy</li>
                            <li className='hover:text-white cursor-pointer duration-300'>Refund and Cancellation</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    </div>
  )
}

export default Home
