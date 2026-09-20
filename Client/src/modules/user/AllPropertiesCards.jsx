import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Toast from "../common/Toast";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const AllPropertiesCards = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const loggedIn =!!localStorage.getItem("token") ||!!sessionStorage.getItem("token") || (!!user && Object.keys(user).length > 0);

  const [allProperties, setAllProperties] = useState([]);
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userDetails, setUserDetails] = useState({ fullName: "", phone: "" });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const API_URL = import.meta.env.VITE_API_URL;

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token? { Authorization: `Bearer ${token}` } : {};
  };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/properties`, {
        withCredentials: true,
        headers: {...getAuthHeader() },
      });
      if (res.data.success) setAllProperties(res.data.properties);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    if (!userDetails.fullName ||!userDetails.phone) {
      showToast("error", "Please fill all details");
      return;
    }
    const finalOwnerId = ownerId || selectedProperty?.owner?._id || selectedProperty?.owner;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("accessToken");
      const res = await axios.post(
        `${API_URL}/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId: finalOwnerId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
           ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (res.data.success) {
        showToast("success", res.data.message);
        setShowModal(false);
        setUserDetails({ fullName: "", phone: "" });
        getAllProperties();
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || "Booking failed");
      if (error.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => { getAllProperties(); }, []);

  const filteredProperties = allProperties
  .filter((p) => filterPropertyAddress === "" || p.address?.toLowerCase().includes(filterPropertyAddress.toLowerCase()))
  .filter((p) => filterPropertyAdType === "" || p.type?.toLowerCase().includes(filterPropertyAdType.toLowerCase()))
  .filter((p) => filterPropertyType === "" || p.title?.toLowerCase().includes(filterPropertyType.toLowerCase()));

  // === 3 NUMBER WALA ALERT ===
  const openModal = (property) => {
    if (!loggedIn) {
      alert("Register please");
      navigate("/register");
      return;
    }
    setSelectedProperty(property);
    setShowModal(true);
  };

  return (
    <div className="p-6 text-white">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({...toast, show: false })} />}

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input type="text" placeholder="Search by Address" value={filterPropertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} className="bg-gray-800/70 border border-gray-700 p-2 rounded w-full sm:w-1/3 text-white" />
        <select value={filterPropertyAdType} onChange={(e) => setPropertyAdType(e.target.value)} className="bg-gray-800/70 border border-gray-700 p-2 rounded text-white">
          <option value="">All Ad Types</option><option value="sale">Sale</option><option value="rent">Rent</option>
        </select>
        <select value={filterPropertyType} onChange={(e) => setPropertyType(e.target.value)} className="bg-gray-800/70 border border-gray-700 p-2 rounded text-white">
          <option value="">All Types</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="land/plot">Land/Plot</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property._id} className="bg-gray-800/70 border border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
            <img src={property.images?.[0] || "https://picsum.photos/400/300"} alt="Property" className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-lg line-clamp-2 min-h-[60px]">{property.address}</h3>
              <p className="text-gray-400 text-sm capitalize">{property.title} - {property.type}</p>
              <div className="mt-2 text-sm space-y-1">
                <p><b>Owner:</b> {property.owner?.name}</p>
                <p><b>Contact:</b> {property.contact}</p>
                <p><b>Price:</b> ₹{property.price}</p>
              </div>
              <div className="mt-auto pt-3">
                <button onClick={() => openModal(property)} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                  Get Info / Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl relative border border-gray-700 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">✖</button>
            <h3 className="text-xl font-bold mb-4">Property Info</h3>
            <img src={selectedProperty.images?.[0]} alt="Property" className="w-full h-48 object-cover rounded mb-4" />
            <form className="mt-4 space-y-2" onSubmit={(e) => { e.preventDefault(); handleBooking("pending", selectedProperty._id, selectedProperty.owner._id); }}>
              <input type="text" placeholder="Your Full Name" required value={userDetails.fullName} onChange={(e) => setUserDetails({...userDetails, fullName: e.target.value })} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
              <input type="text" placeholder="Phone Number" required value={userDetails.phone} onChange={(e) => setUserDetails({...userDetails, phone: e.target.value })} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Book Property</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesCards;