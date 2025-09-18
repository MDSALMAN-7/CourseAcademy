import React, { useState } from 'react'
import logo from "../../public/logo.webp"; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils.js';

function AdminLogin() {


  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const [errorMessage,setErrorMessage]=useState(); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault(); // prevent browser refresh

  try {
    const response = await axios.post(
     `${BACKEND_URL}/admin/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json", // sending data as JSON
        },
      }
    );

    console.log("Login successful...", response.data);

    // Store token + admin info in localStorage
    localStorage.setItem("admin", JSON.stringify(response.data));
    navigate("/admin/dashboard");
    toast.success(response.data.message || "Login successful");

    // Navigate after storing
    
  } catch (error) {
    console.error("Error in login:", error);

    if (error.response) {
      toast.error(error.response.data.errors || "Login failed");
    } else {
      toast.error("Something went wrong. Try again!");
    }
  }
};


  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
        <div className="h-screen container mx-auto flex  items-center justify-center text-white">
            {/* Header */}
            <header className='absolute top-0 left-0 w-full flex justify-between items-center p-5'>
                <div className='flex items-center space-x-2'>
                    <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                    <h1 className='text-2xl text-orange-500 font-bold '>CourseAcademy</h1>
                </div>
                <div className='space-x-4'>
                    <Link to={"/admin/signup"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Signup</Link>
                    <Link to={"/course"} className='bg-orange-500 text-white py-2 px-4  rounded' >Join now</Link>
                </div> 
            </header> 

            {/* Login Page */}
            <div className='w-[450px]  bg-gray-900 p-6 m-6  justify-center rounded-lg shadow-lg md:m-0' >
              <h2 className='text-2xl font-bold text-center mb-4'>Welcome to <span className='text-orange-400'>CourseAcademy</span></h2> 
              <p className='text-gray-400 text-center mb-6'>Login to get paid courses</p>

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor="" className='text-gray mb-2'> Email</label>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full p-2 bg-gray-800 borber border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md ' placeholder='abc@gamil.com' required />
                </div>

                <div className='mb-3'>
                  <label htmlFor="" className='text-gray mb-2'>Password</label>
                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className='w-full p-2 bg-gray-800 borber border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md ' placeholder='password' required />
                </div>

                  {errorMessage && (
                  <div className='mb-2 text-red-600 text-center'>
                    {errorMessage}
                  </div>
                )}
                <button type='submit' className='bg-orange-500 w-full p-2 rounded-lg'>
                  Login
                </button>

              </form>
            </div>
        </div>
    </div>
  )
}

export default AdminLogin
