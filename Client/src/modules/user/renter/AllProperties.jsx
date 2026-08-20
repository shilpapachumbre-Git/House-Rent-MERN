import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [bookedIds, setBookedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAd, setFilterAd] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({ startDate: "", endDate: "", phone: "" });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const propRes = await axios.get(`${API_URL}/api/user/properties`);
        if (propRes.data.success) setProperties(propRes.data.properties);

        if(token){
          const bookingRes = await axios.get(`${API_URL}/api/user/mybookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if(bookingRes.data.success){
            const ids = bookingRes.data.bookings.map(b => b.propertyId?._id).filter(Boolean)
            setBookedIds(ids)
          }
        }
      } catch (error) {
        toast.error("Failed to connect to server");
      } finally { setLoading(false); }
    };
    fetchData();
  }, [API_URL]);

  const openBookingModal = (property) => {
    if(bookedIds.includes(property._id)){
      return toast.info("You have already booked this property ✅")
    }
    if(property.status!== "available" && property.status!== "approved"){
      return toast.error("This property is not available")
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

      {/* Search + Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by Address"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className="bg-[#1e293b] p-2 rounded w-64 border-gray-700 outline-none"
        />
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

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const isBooked = bookedIds.includes(property._id);
          const isUnavailable = property.status!== "available" && property.status!== "approved";

          return (
          <div key={property._id} className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden border-gray-700">
            <img
              src={property.images?.[0] || "https://via.placeholder.com/400x250"}
              className="w-full h-48 object-cover"
              alt="Property"
            />

            <div className="p-4">
              <h3 className="font-bold text-base mb-1">{property.address}</h3>
              <p className="text-gray-400 text-sm capitalize mb-2">{property.title} - {property.type}</p>

              <p className="text-gray-300 text-sm">Owner: {property.contact}</p>
              <p className={`text-sm ${isUnavailable? "text-red-500" : "text-gray-300"}`}>
                Availability: {isUnavailable? "Unavailable" : "Available"}
              </p>
              <p className="text-gray-300 text-sm font-semibold">Price: ₹{property.price}</p>

              {isBooked? (
                <button disabled className="mt-3 w-full bg-green-600 text-white py-2 rounded cursor-not-allowed">
                  Booked
                </button>
              ) : isUnavailable? (
                <button disabled className="mt-3 w-full bg-gray-600 text-white py-2 rounded cursor-not-allowed">
                  Not Available
                </button>
              ) : (
                <button
                  onClick={() => openBookingModal(property)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
                >
                  Get Info / Book
                </button>
              )}
            </div>
          </div>
        )})}
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