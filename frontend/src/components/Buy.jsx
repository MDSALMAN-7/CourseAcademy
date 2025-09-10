// show to payment pages

import axios from 'axios';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

const Buy = () => {
    const {courseId}=useParams(); // receiving id here form course.jsx file
    const [loading,setLoading] = useState(false); // initially false
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || "{}"); // receiving token here
    const token = user?.token; // taking token from user 
     console.log(user)
    const handlePurchases = async () =>{
        if(!token){
            toast.error("Please login to purchase course.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`http://localhost:5001/api/v1/course/buy/${courseId}`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                },
                withCredentials:true,
            });

            console.log("Buy courses",response.data);
            toast.success(response.data.message || "Course purchased successfully...");  // data.message is coming from Backend
            navigate("/purchases");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if(error.response?.status===400){
                toast.error(`You have already purchased this course`);
            }
            else{
                toast.error(error?.response?.data?.errors);   // ?-> it using for if any error will not work then it safe to crashed our website
            }
        }
    }
  return (
    <div className='flex h-screen justify-center items-center'>
        <button className='bg-blue-500 py-2 px-4 hover:bg-blue-800 text-white duration-300 rounded-md' onClick={handlePurchases} disabled={loading}>Buy now</button>
    </div>
  );
}

export default Buy
