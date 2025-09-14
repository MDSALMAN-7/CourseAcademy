import React from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex h-screen">
        {/* SideBar */}
        <div className="w-64 bg-gray-100 p-5">
            <div className="flex items-center flex-col mb-10">
                <img src={logo} alt="profile" className="h-20 w-20 rounded-full" />
                <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
            </div>
            <nav className="flex flex-col space-y-4">
                <Link to="/admin/our-course">
                    <button className="bg-green-500 w-full rounded py-2 text-white">
                        Our Course
                    </button>
                </Link>
                <Link to="/admin/create-course">
                    <button className="bg-orange-400 w-full rounded py-2 text-white">
                        Create Course
                    </button>
                </Link>
                <Link to="/">
                    <button className="bg-red-500 w-full rounded py-2 text-white">
                        Home
                    </button>
                </Link>
                <Link to="/admin/login">
                    <button className="bg-yellow-400 w-full rounded py-2 text-white">
                        Log Out
                    </button>
                </Link>
            </nav>
      </div>

      <div className="flex h-screen items-center justify-center ml-[40%]">
        Welcome!!!
      </div>
    </div>
  );
}

export default Dashboard;
