import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("name") || "User";

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

  return (
    <div className="bg-[#121826] rounded-xl p-6 border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-indigo-400">All My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10 text-gray-400">You have no bookings yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-sm font-semibold">Booking ID</th>
                <th className="p-3 text-sm font-semibold">Property ID</th>
                <th className="p-3 text-sm font-semibold">Tenant Name</th>
                <th className="p-3 text-sm font-semibold">Phone</th>
                <th className="p-3 text-sm font-semibold">From</th>
                <th className="p-3 text-sm font-semibold">To</th>
                <th className="p-3 text-sm font-semibold">Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-700 hover:bg-[#1e293b]">
                  <td className="p-3 text-xs">{booking._id}</td>
                  <td className="p-3 text-xs">{booking.propertyId?._id}</td>
                  <td className="p-3">{userName}</td>
                  <td className="p-3">{booking.phone}</td>
                  <td className="p-3">{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full
                      ${booking.status === "pending" 
                        ? "bg-yellow-500/20 text-yellow-400" 
                        : booking.status === "booked" 
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    </div>
  );
};

export default AllBookings;