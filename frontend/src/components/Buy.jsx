// show to payment pages

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

const Buy = () => {
  const { courseId } = useParams(); // receiving id here form course.jsx file
  const [loading, setLoading] = useState(false); // initially false
  const navigate = useNavigate();

  const [course, setCourse] = useState({}); // initianily his value empty object
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}"); // receiving token here
  const token = user?.token; // taking token from user
  //   console.log(user);

  // stripe UI
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");


  useEffect(() => {
    const fetchBuyCourseData = async () => {
      if (!token) {
        setError("Please login to purchase course.");
        return;
      }
      try {
        // setLoading(true);
        const response = await axios.post(
          `http://localhost:5001/api/v1/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log(response.data);
        setCourse(response.data.course); // be able to use on UI
        setClientSecret(response.data.clientSecret); // be able to use on UI
       
        setLoading(false);
      } catch (error) {
        setLoading(false);  
        if (error.response?.status === 400) {
          setError(`You have already purchased this course`);
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.errors); // ?-> it using for if any error will not work then it safe to crashed our website
        }
      }
    };
    fetchBuyCourseData();
  }, [courseId]); // useEffect will run whenever our course id changes


  // handlePurchase function click event
  const handlePurchase = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      return;
    }

    setLoading(true);  // in starting setLoading is true
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Card is not found");
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe paymont error", error);
      setLoading(false);
      setCardError(error.message);
    } else {
      console.log("[PaymentMethod created]", paymentMethod);
    }

    // if don't get clientSecret from backend
    if (!clientSecret) {
      console.log("NO clientSeceret found");
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(
        // here i give alternate name for this error confirm error
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              name: user?.user.firstName,
              email: user?.user.email,
            },
          },
        }
      );
    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded: ", paymentIntent);
      setCardError("your payment Id: ", paymentIntent);
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        courseId: course._id,
        paymetnId: paymentIntent._id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("Payment Info : ", paymentInfo);
      await axios.post("http://localhost:5001/api/v1/order",paymentInfo,{
        headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          
      }) //seding paymentInfo data into data base

      .then(response =>{
        console.log(response.data);
      }).catch((error)=>{ // if error
         console.log(error);
         toast.error("Error in making paytment")
      })

      toast.success("Payment is successful...");
      navigate("/purchases");
    }
    setLoading(false);
  };

  return (
    <>
      {error ? ( 
        // this is for error checking and show UI
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
            {/* left side */}
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          {/* Right side payment section */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                {/* stripe method */}
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Buy;
