import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookedIds, setBookedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("properties"); // properties | bookings
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAd, setFilterAd] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({ startDate: "", endDate: "", phone: "" });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const userName = localStorage.getItem("name") || "User";

  useEffect(() => {
    fetchData();
  }, [API_URL]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const propRes = await axios.get(`${API_URL}/api/user/properties`);
      if (propRes.data.success) setProperties(propRes.data.properties);

      if(token){
        const bookingRes = await axios.get(`${API_URL}/api/user/mybookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if(bookingRes.data.success){
          setBookings(bookingRes.data.bookings)
          const ids = bookingRes.data.bookings.map(b => b.propertyId?._id).filter(Boolean)
          setBookedIds(ids)
        }
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally { setLoading(false); }
  };

  const openBookingModal = (property) => {
    if(bookedIds.includes(property._id)){
      return toast.info("You have already booked this property ✅")
    }
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if(!token) return navigate("/login");

    try {
      await axios.post(
        `${API_URL}/api/user/bookinghandle/${selectedProperty._id}`,
        { ownerId: selectedProperty.owner._id,...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking Confirmed Successfully! ✅");
      setShowModal(false);
      setFormData({ startDate: "", endDate: "", phone: "" });
      setBookedIds([...bookedIds, selectedProperty._id])
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed");
    }
  };

  const filteredProperties = properties.filter(p =>
    p.address.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === "all" || p.title === filterType) &&
    (filterAd === "all" || p.type === filterAd)
  );

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6">
      <ToastContainer theme="dark" position="top-right"/>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-400">RentEase</h1>
        <div className="flex gap-3 items-center">
          <span>Hi, {userName}</span>
          <button onClick={()=>{localStorage.clear(); navigate("/login")}} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700">Log Out</button>
        </div>
      </div>

      <div className="bg-[#121826] rounded-xl p-6 border border-gray-800">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-700 mb-6">
          <button onClick={()=>setActiveTab("properties")} className={`pb-2 font-semibold ${activeTab==="properties"?"border-b-2 border-indigo-500 text-indigo-400":"text-gray-400"}`}>All Properties</button>
          <button onClick={()=>setActiveTab("bookings")} className={`pb-2 font-semibold ${activeTab==="bookings"?"border-b-2 border-indigo-500 text-indigo-400":"text-gray-400"}`}>Booking History</button>
        </div>

        {activeTab === "properties" && (
          <>
            {/* Filters - Screenshot sarkhe */}
            <div className="flex gap-4 mb-8 flex-wrap">
              <input type="text" placeholder="Search by Address" value={search} onChange={e=>setSearch(e.target.value)} className="bg-[#1e293b] p-2 rounded w-64 border border-gray-700 outline-none"/>
              <select value={filterAd} onChange={e=>setFilterAd(e.target.value)} className="bg-[#1e293b] p-2 rounded border-gray-700 outline-none">
                <option value="all">All Ad Types</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
              <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="bg-[#1e293b] p-2 rounded border-gray-700 outline-none">
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land/plot">Land/Plot</option>
              </select>
            </div>

            {/* Property Cards - Screenshot design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const isBooked = bookedIds.includes(property._id);
                return (
                <div key={property._id} className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-indigo-600/30 transition">
                  <img src={property.images?.[0] || "https://via.placeholder.com/400x200"} className="w-full h-48 object-cover" alt="Property"/>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{property.address}</h3>
                    <p className="text-gray-400 text-sm capitalize mb-2">{property.title} - {property.type}</p>
                    <p className="text-gray-300 text-sm">Owner: {property.owner?.phone || 'N/A'}</p>
                    <p className="text-gray-400 text-sm">Availability: {property.availability || 'Available'}</p>
                    <p className="text-green-400 font-bold mt-1 mb-3">Price: ₹{property.price}</p>

                    {isBooked? (
                      <button disabled className="w-full bg-green-600 text-white py-2 rounded cursor-not-allowed font-semibold">Booked ✅</button>
                    ) : (
                      <button onClick={() => openBookingModal(property)} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">Get Info / Book</button>
                    )}
                  </div>
                </div>
              )})}
            </div>
          </>
        )}

        {activeTab === "bookings" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-indigo-400">All My Bookings</h2>
            {bookings.length === 0? <p className="text-gray-400">No bookings yet</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 text-sm">Booking ID</th>
                      <th className="p-3 text-sm">Property ID</th>
                      <th className="p-3 text-sm">Tenant Name</th>
                      <th className="p-3 text-sm">Phone</th>
                      <th className="p-3 text-sm">Booking Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} className="border-b border-gray-700 hover:bg-[#1e293b]">
                        <td className="p-3 text-xs">{b._id}</td>
                        <td className="p-3 text-xs">{b.propertyId?._id}</td>
                        <td className="p-3">{userName}</td>
                        <td className="p-3">{b.phone || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${b.status==="booked"?"bg-green-500/20 text-green-400":"bg-yellow-500/20 text-yellow-400"}`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-lg w-96 border-gray-700">
            <h3 className="text-xl font-bold mb-4">Book Property</h3>
            <img src={selectedProperty.images?.[0]} className="w-full h-32 object-cover rounded mb-3" alt="Property"/>
            <form onSubmit={handleBook}>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-800 rounded" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})}/>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-800 rounded" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})}/>
              <input type="text" required className="w-full p-2 mb-3 bg-gray-800 rounded" placeholder="Your Phone" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})}/>
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-green-600 py-2 rounded hover:bg-green-700">Confirm Booking</button>
                <button type="button" onClick={()=>setShowModal(false)} className="w-full bg-red-600 py-2 rounded hover:bg-red-700">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllProperties;