import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const getMyBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if(!token){
        message.error("Please login first");
        navigate("/login");
        return;
      }
      const res = await axios.get(`${API_URL}/api/user/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.data.success) setBookings(res.data.bookings);
      else message.error(res.data.message);
    } catch (error) {
      if(error.response?.status === 401) navigate("/login");
      else message.error("Failed to fetch bookings");
    } finally { setLoading(false); }
  };

  const getStatusColor = (status) => {
    if(status === 'approved') return 'text-green-400'; 
    if(status === 'pending') return 'text-yellow-400';
    if(status === 'cancelled') return 'text-red-400';
    if(status === 'completed') return 'text-blue-400';
    return 'text-gray-400';
  }

  useEffect(() => { getMyBookings(); }, []);

  if(loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spin size="large"/></div>

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-transparent text-gray-400 hover:text-white">All Properties</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md border border-blue-400">Booking History</button>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 border-gray-700 rounded-lg shadow-2xl backdrop-blur-sm">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-blue-400">All My Bookings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Booking ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Property ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Tenant Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0? bookings.map((b) => (
                  <tr key={b._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3 text-gray-200 text-xs">{b._id}</td>
                    <td className="px-4 py-3 text-gray-200 text-xs">{b.propertyId?._id || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-200">{b.userName || b.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-200">{b.phone || b.userId?.phone || 'N/A'}</td>
                    <td className={`px-4 py-3 font-semibold ${getStatusColor(b.bookingStatus)}`}>
                      {b.bookingStatus === 'approved'? 'booked' : b.bookingStatus}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 italic">
                      You haven't booked any property yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllBookings;