import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({ startDate: "", endDate: "", phone: "" });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/user/properties`);
        if (data.success) setProperties(data.properties);
      } catch (error) {
        toast.error("Server la connect hot nahi");
      } finally { setLoading(false); }
    };
    fetchProperties();
  }, []);

  const openBookingModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if(!token) return navigate("/login");

    try {
      const res = await axios.post(
        `${API_URL}/api/user/bookinghandle/${selectedProperty._id}`,
        {
          ownerId: selectedProperty.owner._id,
         ...formData 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed");
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-white">All Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="border-gray-700 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img src={property.images?.[0]? `${API_URL}/uploads/${property.images[0]}` : "https://via.placeholder.com/400x200"} className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h3 className="text-xl font-bold text-white">{property.address}</h3>
              <p className="text-green-400 font-bold text-lg">₹{property.price} / month</p>
              <p className="text-gray-300">Owner: {property.owner?.name}</p>
              <button
                onClick={() => openBookingModal(property)}
                className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold text-white mb-4">Book Property</h3>
            <form onSubmit={handleBook}>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} placeholder="Start Date"/>
              <input type="date" required className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} placeholder="End Date"/>
              <input type="text" required className="w-full p-2 mb-3 bg-gray-700 text-white rounded" placeholder="Your Phone"
                value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})}/>
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-green-600 py-2 rounded">Confirm Booking</button>
                <button type="button" onClick={()=>setShowModal(false)} className="w-full bg-red-600 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllProperties;