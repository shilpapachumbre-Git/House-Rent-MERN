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
    if(!API_URL) {
      toast.error("API_URL not found. Check.env file")
    }
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
          const ids = bookingRes.data.bookings
           .filter(b => b.status === "pending" || b.status === "booked") // fakt active bookings
           .map(b => b.propertyId?._id).filter(Boolean)
          setBookedIds(ids)
        }
      }
    } catch (error) {
      console.log("Fetch Error:", error)
      toast.error(error.response?.data?.message || "Failed to connect to server");
    } finally { setLoading(false); }
  };

  const openBookingModal = (property) => {
    if(bookedIds.includes(property._id)){
      return toast.info("You have already sent request for this property ✅")
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
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast.success("Booking Request Sent! Owner will approve soon ✅");
      setShowModal(false);
      setFormData({ startDate: "", endDate: "", phone: "" });
      setBookedIds([...bookedIds, selectedProperty._id])
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const filteredProperties = properties.filter(p =>
    p.address?.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === "all" || p.propertyType === filterType) && // FIX: title -> propertyType
    (filterAd === "all" || p.type === filterAd)
  );

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div>
      <ToastContainer theme="dark" position="top-right"/>

      <div className="flex gap-4 mb-8 flex-wrap">
        <input type="text" placeholder="Search by Address" value={search} onChange={e=>setSearch(e.target.value)} className="bg-[#1e293b] p-2 rounded w-64 border border-gray-700 outline-none text-white"/>
        <select value={filterAd} onChange={e=>setFilterAd(e.target.value)} className="bg-[#1e293b] p-2 rounded border border-gray-700 outline-none text-white">
          <option value="all">All Ad Types</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="bg-[#1e293b] p-2 rounded border-gray-700 outline-none text-white">
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land/plot">Land/Plot</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length === 0? <p className="text-gray-400 col-span-3 text-center">No properties found</p> :
        filteredProperties.map((property) => {
          const isBooked = bookedIds.includes(property._id);
          return (
          <div key={property._id} className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden border-gray-700 hover:shadow-indigo-600/30 transition">
            <img src={property.images?.[0] || "https://via.placeholder.com/400x200"} className="w-full h-48 object-cover" alt="Property"/>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-white">{property.address}</h3>
              <p className="text-gray-400 text-sm capitalize mb-2">{property.propertyType} - {property.type}</p> {/* FIX */}
              <p className="text-gray-300 text-sm">Owner: {property.owner?.phone || 'N/A'}</p>
              <p className="text-gray-400 text-sm">Availability: {property.availability || 'Available'}</p>
              <p className="text-green-400 font-bold mt-1 mb-3">Price: ₹{property.price}</p>

              {isBooked? (
                <button disabled className="w-full bg-green-600 text-white py-2 rounded cursor-not-allowed font-semibold">Request Sent ✅</button>
              ) : (
                <button onClick={() => openBookingModal(property)} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">Get Info / Book</button>
              )}
            </div>
          </div>
        )})}
      </div>

      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-lg w-96 border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Book Property</h3>
            <img src={selectedProperty.images?.[0]} className="w-full h-32 object-cover rounded mb-3" alt="Property"/>
            <form onSubmit={handleBook}>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-800 rounded text-white" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})}/>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-800 rounded text-white" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})}/>
              <input type="text" required className="w-full p-2 mb-3 bg-gray-800 rounded text-white" placeholder="Your Phone" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})}/>
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-green-600 py-2 rounded hover:bg-green-700 text-white">Confirm Booking</button>
                <button type="button" onClick={()=>setShowModal(false)} className="w-full bg-red-600 py-2 rounded hover:bg-red-700 text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllProperties;