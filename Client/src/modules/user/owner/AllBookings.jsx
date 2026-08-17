import { message, Spin } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerAllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";
  const userName = localStorage.getItem("userName") || "Owner"; // Navbar sathi

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if(!token){
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/owner/bookings`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAllBookings(response.data.bookings); 
      } else {
        message.error(response.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      else message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllBookings(); }, []);

  const handleStatus = async (bookingId, newStatus) => {
    const updatedStatus = newStatus === "booked" ? "approved" : "pending";
    
    setAllBookings(prev => 
      prev.map(b => b._id === bookingId ? {...b, bookingStatus: updatedStatus} : b)
    );

    try {
      const token = localStorage.getItem("token");
      const url = newStatus === "booked" 
        ? `${API_URL}/api/owner/bookings/${bookingId}/accept`
        : `${API_URL}/api/owner/bookings/${bookingId}/reject`;

      const res = await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
        getAllBookings();
      }
    } catch (error) {
      message.error("Failed to update booking status");
      getAllBookings();
    }
  };

  const getStatusColor = (status) => {
    if(status === 'approved') return 'text-green-500'; // booked
    if(status === 'pending') return 'text-yellow-400';
    if(status === 'cancelled') return 'text-red-500';
    return 'text-gray-400';
  }

  if(loading) return <div className="flex justify-center items-center min-h-screen bg-[#0a0e1a]"><Spin size="large"/></div>

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Navbar */}
      <nav className="bg-[#111827] px-6 py-3 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">RentEase</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Hi {userName}</span>
          <button 
            onClick={() => {localStorage.clear(); navigate("/login")}}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="flex gap-6 text-sm">
          <button onClick={() => navigate("/add-property")} className="text-gray-400 hover:text-white">Add Property</button>
          <button onClick={() => navigate("/all-properties")} className="text-gray-400 hover:text-white">All Properties</button>
          <button className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold">All Bookings</button>
        </div>
      </div>

      {/* Table Card */}
      <div className="p-6">
        <div className="bg-[#111827] rounded-lg border border-gray-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Booking ID</th>
                  <th className="py-3 px-4 text-left">Property ID</th>
                  <th className="py-3 px-4 text-left">Tenant Name</th>
                  <th className="py-3 px-4 text-left">Tenant Phone</th>
                  <th className="py-3 px-4 text-center">Booking Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.length > 0 ? (
                  allBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-800 hover:bg-gray-800/40">
                      <td className="py-3 px-4 text-gray-200 text-xs">{booking._id}</td>
                      <td className="py-3 px-4 text-gray-200 text-xs">{booking.propertyId?._id}</td>
                      <td className="py-3 px-4 text-gray-200">{booking.userName || booking.userId?.name}</td>
                      <td className="py-3 px-4 text-gray-200">{booking.phone || booking.userId?.phone}</td>

                      <td className={`py-3 px-4 text-center font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus === 'approved' ? 'booked' : booking.bookingStatus}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {booking.bookingStatus === "approved" ? (
                          <button
                            onClick={() => handleStatus(booking._id, "pending")}
                            className="px-4 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold"
                          >
                            Mark Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatus(booking._id, "booked")}
                            className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold"
                          >
                            Mark Booked
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400">No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerAllBookings;