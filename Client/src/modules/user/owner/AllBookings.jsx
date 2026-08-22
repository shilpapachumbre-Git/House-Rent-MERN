import { message, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOwnerBookings, acceptBooking, rejectBooking } from "../../../api/authApi";

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); 
  const navigate = useNavigate();

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerBookings();
      if (res.data.success) {
        setAllBookings(res.data.bookings); 
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Session expired");
        navigate("/login");
      }
      else message.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllBookings(); }, []);

  const handleStatus = async (bookingId, action) => {
    setUpdatingId(bookingId); 
    try {
      const res = action === "accept" ? await acceptBooking(bookingId) : await rejectBooking(bookingId);
      if (res.data.success) {
        message.success(res.data.message);
        getAllBookings(); 
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    if(status === 'booked') return 'text-green-500'; 
    if(status === 'pending') return 'text-yellow-400';
    if(status === 'rejected') return 'text-red-500';
    return 'text-gray-400';
  }

  if(loading) return <div className="flex justify-center items-center py-20"><Spin size="large"/></div>

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-6">All Bookings</h2>
      <div className="bg-gray-900/80 rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Booking ID</th>
                <th className="py-3 px-4 text-left">Property</th>
                <th className="py-3 px-4 text-left">Tenant</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.length > 0 ? allBookings.map((booking) => {
                // ITHE FIX: junya + navin donhi sathi fallback
                const currentStatus = booking.bookingStatus || booking.status || 'pending';
                const tenantName = booking.userName || booking.userId?.name || "N/A"; // userName pan check kar
                const tenantPhone = booking.phone || booking.userId?.phone || "N/A"; // phone sathi fallback

                return (
                <tr key={booking._id} className="border-b border-gray-700 hover:bg-gray-800/40">
                  <td className="py-3 px-4 text-xs text-gray-300">{booking._id.slice(-6)}</td>
                  <td className="py-3 px-4 text-gray-200">{booking.propertyId?.title || "Deleted"}</td>
                  <td className="py-3 px-4 text-gray-200">{tenantName}</td>
                  <td className="py-3 px-4 text-gray-200">{tenantPhone}</td>
                  <td className={`py-3 px-4 text-center font-semibold capitalize ${getStatusColor(currentStatus)}`}>
                    {currentStatus}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {currentStatus === "pending" && ( // <- ithe pan currentStatus vapra
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => handleStatus(booking._id, "accept")} 
                          disabled={updatingId === booking._id}
                          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
                        >
                          {updatingId === booking._id ? "Accepting..." : "Accept"}
                        </button>
                        <button 
                          onClick={() => handleStatus(booking._id, "reject")}
                          disabled={updatingId === booking._id} 
                          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                        >
                          {updatingId === booking._id ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}) : <tr><td colSpan={6} className="py-10 text-center text-gray-400">No bookings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;