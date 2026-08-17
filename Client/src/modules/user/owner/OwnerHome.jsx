import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import { getUserData } from "../../../api/authApi";
import AddProperty from "./AddProperty";
import AllProperties from "./AllProperties";
import AllBookings from "./AllBookings";

const tabs = [
  { name: "Add Property", component: <AddProperty /> },
  { name: "All Properties", component: <AllProperties /> },
  { name: "All Bookings", component: <AllBookings /> },
];

const OwnerHome = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadUser = async () => {
      try {
        let currentUser = user;
        
        // Jar context madhe user nahi tar API ne fetch kar
        if (!currentUser) {
          const res = await getUserData();
          currentUser = res.data.user;
          setUser(currentUser);
        }

        // Owner nahi tar login la pathav
        if (currentUser.role!== 'owner') {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth Error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [user, setUser, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="text-center text-white text-xl animate-pulse">Loading...</div>
    </div>
  );

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg shadow-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h2
            onClick={() => navigate("/")}
            className="text-3xl font-extrabold text-indigo-400 tracking-wide cursor-pointer"
          >
            RentEase
          </h2>
          <div className="flex items-center gap-6">
            <h5 className="font-medium text-gray-300 hidden md:block">
              Hi <span className="text-indigo-400 font-bold">{user.name}</span>
            </h5>
            <button
              onClick={handleLogOut}
              className="px-4 py-2 text-sm bg-red-500/80 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-4 border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 font-medium text-sm transition-all duration-200 rounded-t-lg whitespace-nowrap
            ${activeTab === index
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10 shadow-inner"
                  : "text-gray-400 hover:text-indigo-300 hover:bg-gray-800/40"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md mt-6 p-6 shadow-2xl rounded-xl transition-all min-h-[60vh]">
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;