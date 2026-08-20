import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [bookedIds, setBookedIds] = useState([]);
  const [loading, setLoading] = useState(true);
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
            // FIX 1: propertyId null asel tar error yeil mhanun?. lavla
            const ids = bookingRes.data.bookings.map(b => b.propertyId?._id).filter(Boolean)
            setBookedIds(ids)
          }
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to connect to server");
      } finally { setLoading(false); }
    };
    fetchData();
  }, [API_URL]); // FIX 2: dependency add keli

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
        { headers: { Authorization: `Bearer ${token}` }
        });

      toast.success("Booking Confirmed Successfully! ✅", {position: "top-center", autoClose: 3000});
      setShowModal(false);
      setFormData({ startDate: "", endDate: "", phone: "" });
      setBookedIds([...bookedIds, selectedProperty._id])

    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed");
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <ToastContainer theme="dark" position="top-right"/>
      <h2 className="text-3xl font-bold mb-6 text-white">All Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const isBooked = bookedIds.includes(property._id);

          return (
          <div key={property._id} className="border border-gray-700 bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-indigo-600/40 transition transform hover:-translate-y-1">
            <img src={property.images?.[0] || "https://via.placeholder.com/400x200"} className="w-full h-48 object-cover" alt="Property" onError={(e)=> e.target.src="https://via.placeholder.com/400x200"}/>

            <div className="p-4">
              <h3 className="text-xl font-bold text-white">{property.address}</h3>
              <p className="text-gray-400 capitalize">{property.title} - {property.type}</p>
              <p className="text-green-400 font-bold text-lg mt-1">₹{property.price} / month</p>
              <p className="text-gray-300 text-sm mt-1">Owner: {property.owner?.name}</p>
              <p className="text-gray-400 text-xs">Contact: {property.contact}</p>

              {isBooked? (
                <button disabled className="mt-3 w-full bg-green-600 text-white py-2 rounded cursor-not-allowed">
                  Booked ✅
                </button>
              ) : (
                <button onClick={() => openBookingModal(property)} className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                  Book Now
                </button>
              )}
            </div>
          </div>
        )})}
      </div>

      {/* BOOKING MODAL */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Book Property</h3>
            <img src={selectedProperty.images?.[0]} className="w-full h-32 object-cover rounded mb-3" alt="Property"/>
            <form onSubmit={handleBook}>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-700 text-white rounded border-gray-600" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})}/>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-700 text-white rounded border border-gray-600" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})}/>
              <input type="text" required className="w-full p-2 mb-3 bg-gray-700 text-white rounded border-gray-600" placeholder="Your Phone" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})}/>
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