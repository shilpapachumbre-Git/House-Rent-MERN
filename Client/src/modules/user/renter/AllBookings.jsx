import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/user/mybookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.log("Fetch Bookings Error:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-white">Loading bookings...</div>;
  if (bookings.length === 0) {
    return <div className="text-center py-10 text-gray-400">You have no bookings yet.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] p-6">
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      
      <div className="bg-[#121826] rounded-xl p-6 border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">All My Bookings</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-sm font-semibold">Booking ID</th>
                <th className="p-3 text-sm font-semibold">Property ID</th>
                <th className="p-3 text-sm font-semibold">Tenant Name</th>
                <th className="p-3 text-sm font-semibold">Phone</th>
                <th className="p-3 text-sm font-semibold">Booking Status</th>
              </tr>
            </thead>
            <tbody className="bg-[#1e293b]">
              {bookings.map((booking) => {
                const currentStatus = booking.bookingStatus || booking.status || 'pending';
                return (
                <tr key={booking._id} className="border-b border-gray-700 hover:bg-[#25324a] transition">
                  <td className="p-3 text-xs text-gray-300">{booking._id.slice(-6)}</td>
                  <td className="p-3 text-xs text-gray-300">{booking.propertyId?._id?.slice(-6) || 'N/A'}</td>
                  <td className="p-3 text-gray-200">{booking.userId?.name || booking.userName || 'N/A'}</td>
                  <td className="p-3 text-gray-200">{booking.userId?.phone || booking.phone || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                      currentStatus === "booked" 
                        ? "bg-green-500/20 text-green-400" 
                        : currentStatus === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {currentStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;