import { UserContext } from "../../../App";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import AllProperties from "./AllProperties";
import AllBookings from "./AllBookings";

const CustomTabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} className="w-full mt-6">
      {value === index && <div>{children}</div>}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const RenterHome = () => {
  const { user, setUser } = useContext(UserContext); // <-- BADAL
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user?.role !== 'renter') {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return <div className="text-center py-10 text-white">Loading...</div>;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <nav className="bg-black/30 backdrop-blur-lg shadow-md px-6 py-4 flex items-center justify-between border-b border-gray-700 sticky top-0 z-10">
        <h2 className="text-3xl font-extrabold text-indigo-400 tracking-wide">RentEase</h2>
        <div className="flex items-center gap-6">
          <h5 className="font-medium text-gray-200">Hi, {user.name}</h5> {/* BADAL */}
          <button onClick={handleLogOut} className="px-4 py-2 text-sm bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition">
            Log Out
          </button>
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto mt-10 bg-gray-900/80 border-gray-700 shadow-xl rounded-xl p-6 backdrop-blur-md">
        <div className="flex border-b border-gray-700">
          <button className={`px-6 py-2 text-sm font-medium transition-colors ${value === 0 ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-indigo-300"}`} onClick={() => setValue(0)}>
            All Properties
          </button>
          <button className={`px-6 py-2 text-sm font-medium transition-colors ${value === 1 ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-indigo-300"}`} onClick={() => setValue(1)}>
            My Bookings
          </button>
        </div>

        <CustomTabPanel value={value} index={0}><AllProperties /></CustomTabPanel>
        <CustomTabPanel value={value} index={1}><AllBookings /></CustomTabPanel>
      </div>
    </div>
  );
};

export default RenterHome;