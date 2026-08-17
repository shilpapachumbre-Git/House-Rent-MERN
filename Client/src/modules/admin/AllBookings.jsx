import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const navigate = useNavigate();

  const getAllBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/bookings",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAllBookings(response.data.bookings); // <- .bookings
      } else {
        message.error(response.data.message);
        navigate("/login"); 
      }
    } catch (error) {
      message.error("Failed to fetch bookings");
    }
  };

  useEffect(() => { getAllBooking(); }, []);

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-4">All Bookings</h2>
      <table className="min-w-full bg-gray-900/80 rounded-xl">
        <thead className="bg-indigo-600/80 text-white">
          <tr>
            <th className="py-3 px-4">Booking ID</th>
            <th className="py-3 px-4">Tenant</th>
            <th className="py-3 px-4">Owner</th>
            <th className="py-3 px-4">Property</th>
            <th className="py-3 px-4">Dates</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {allBookings.length > 0 ? (
            allBookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-indigo-500/20">
                <td className="py-2 px-4 text-center">{booking._id.slice(-6)}</td>
                <td className="py-2 px-4 text-center">
                  {booking.userId?.name || booking.userName} <br/> 
                  <span className="text-xs">{booking.phone}</span>
                </td>
                <td className="py-2 px-4 text-center">{booking.ownerId?.name || "N/A"}</td>
                <td className="py-2 px-4 text-center text-indigo-400">
                  {booking.propertyId?.title} <br/>
                  <span className="text-xs text-gray-400">₹{booking.propertyId?.propertyAmt}</span>
                </td>
                <td className="py-2 px-4 text-center text-xs">
                  {new Date(booking.startDate).toLocaleDateString()} to <br/>
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className={`py-2 px-4 text-center font-semibold ${
                  booking.bookingStatus === "approved" ? "text-green-400"
                  : booking.bookingStatus === "pending" ? "text-yellow-400"
                  : "text-red-400"
                }`}>
                  {booking.bookingStatus}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center py-6 text-gray-400">No bookings found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default AllBookings;