import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import AllUsers from "./AllUsers";
import AllProperty from "./AllProperty"; 
import AllBookings from "./AllBookings";

const AdminHome = () => {
  const { user, setUser } = useContext(UserContext); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); 
    navigate("/login");
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg shadow-md py-4 px-4 md:px-8 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-400 tracking-wide">RentEase</h2>
        <div className="flex items-center space-x-3 md:space-x-6">
          <span className="text-gray-200 text-sm md:text-base hidden sm:block">Hi, {user.name}</span> 
          <button onClick={handleLogOut} className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            Log Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto w-full py-24 px-4"> 
        <div className="flex space-x-2 md:space-x-4 mb-6 border-b border-gray-700 overflow-x-auto">
          <button onClick={() => setActiveTab("users")} className={`pb-2 px-3 md:px-4 text-sm md:text-lg font-medium whitespace-nowrap ${activeTab === "users" ? "border-b-2 border-indigo-400 text-indigo-400" : "text-gray-400"}`}>
            All Users
          </button>
          <button onClick={() => setActiveTab("properties")} className={`pb-2 px-3 md:px-4 text-sm md:text-lg font-medium whitespace-nowrap ${activeTab === "properties" ? "border-b-2 border-indigo-400 text-indigo-400" : "text-gray-400"}`}>
            All Properties
          </button>
          <button onClick={() => setActiveTab("bookings")} className={`pb-2 px-3 md:px-4 text-sm md:text-lg font-medium whitespace-nowrap ${activeTab === "bookings" ? "border-b-2 border-indigo-400 text-indigo-400" : "text-gray-400"}`}>
            All Bookings
          </button>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl p-4 md:p-6 shadow-2xl text-gray-200 overflow-hidden">
          {activeTab === "users" && <AllUsers />}
          {activeTab === "properties" && <AllProperty />} 
          {activeTab === "bookings" && <AllBookings />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;