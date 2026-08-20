import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL; // Render cha backend URL

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

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;

  if (bookings.length === 0) {
    return <div className="text-center py-10 text-gray-400">You have no bookings yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <div key={booking._id} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-indigo-500/20 transition">

          {/* Property Image */}
          <img
            src={booking.propertyId?.images?.[0] || "https://via.placeholder.com/400x250"}
            alt={booking.propertyId?.title}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />

          {/* Property Details */}
          <h3 className="text-lg font-bold text-indigo-300">{booking.propertyId?.title}</h3>
          <p className="text-sm text-gray-400">{booking.propertyId?.address}</p>
          <p className="text-sm text-gray-400">Type: {booking.propertyId?.type}</p>
          <p className="text-lg font-semibold text-green-400 mt-2">₹{booking.propertyId?.price}/month</p>

          {/* Booking Details */}
          <div className="mt-4 border-t border-gray-700 pt-3">
            <p><span className="font-semibold">From:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">To:</span> {new Date(booking.endDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Your Phone:</span> {booking.phone}</p>
            <p><span className="font-semibold">Owner:</span> {booking.ownerId?.name}</p>
          </div>

          {/* Status Badge */}
          <span className={`mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full
            ${booking.status === "pending"? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
            {booking.status.toUpperCase()}
          </span>
        </div>
      ))}
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    </div>
  );
};

export default AllBookings;