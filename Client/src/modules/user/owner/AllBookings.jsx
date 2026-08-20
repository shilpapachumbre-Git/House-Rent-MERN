import { message, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOwnerBookings, acceptBooking, rejectBooking } from "../../../api/authApi";

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Owner"; 

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerBookings();
      if (res.data.success) {
        setAllBookings(res.data.bookings); 
      }
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      else message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllBookings(); }, []);

  const handleStatus = async (bookingId, action) => {
    try {
      const res = action === "accept" ? await acceptBooking(bookingId) : await rejectBooking(bookingId);
      if (res.data.success) {
        message.success(res.data.message);
        getAllBookings();
      }
    } catch (error) {
      message.error("Failed to update booking status");
    }
  };

  const getStatusColor = (status) => {
    if(status === 'approved') return 'text-green-500'; 
    if(status === 'pending') return 'text-yellow-400';
    return 'text-red-500';
  }

  if(loading) return <div className="flex justify-center items-center py-20"><Spin size="large"/></div>

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-6">All Bookings</h2>
      <div className="bg-gray-900/80 rounded-lg border-gray-700 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Booking ID</th><th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Tenant</th><th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.length > 0 ? allBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-700 hover:bg-gray-800/40">
                  <td className="py-3 px-4 text-xs">{booking._id}</td>
                  <td className="py-3 px-4">{booking.propertyId?.title}</td>
                  <td className="py-3 px-4">{booking.userId?.name}</td>
                  <td className="py-3 px-4">{booking.userId?.phone}</td>
                  <td className={`py-3 px-4 text-center font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {booking.bookingStatus === "pending" && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleStatus(booking._id, "accept")} className="px-3 py-1 text-sm bg-green-600 rounded-md">Accept</button>
                        <button onClick={() => handleStatus(booking._id, "reject")} className="px-3 py-1 text-sm bg-red-600 rounded-md">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan={6} className="py-10 text-center text-gray-400">No bookings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;