import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Toast from "../common/Toast";
import { UserContext } from "../../App";

const AllPropertiesCards = () => {
  const { user } = useContext(UserContext);
  const loggedIn = !!user;

  const [allProperties, setAllProperties] = useState([]);
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userDetails, setUserDetails] = useState({ fullName: "", phone: "" });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const API_URL = "http://localhost:5000";

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/user/properties`,
        { withCredentials: true }
      );
      if (res.data.success) setAllProperties(res.data.properties);
    } catch (error) {
      console.log(error);
      showToast("error", "Failed to fetch properties");
    }
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    if (!userDetails.fullName || !userDetails.phone) {
      showToast("error", "Please fill all details");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId },
        { withCredentials: true }
      );

      if (res.data.success) {
        showToast("success", res.data.message);
        setShowModal(false);
        setUserDetails({ fullName: "", phone: "" });
        getAllProperties();
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Booking failed");
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  // FILTER FIX: backend pramane
  const filteredProperties = allProperties
    .filter((property) => filterPropertyAddress === "" || property.address?.toLowerCase().includes(filterPropertyAddress.toLowerCase()))
    .filter((property) => filterPropertyAdType === "" || property.type?.toLowerCase().includes(filterPropertyAdType.toLowerCase()))
    .filter((property) => filterPropertyType === "" || property.title?.toLowerCase().includes(filterPropertyType.toLowerCase()));

  const openModal = (property) => {
    if (!loggedIn) {
      showToast("error", "Please login first");
      return;
    }
    setSelectedProperty(property);
    setShowModal(true);
  };

  return (
    <div className="p-6 text-white">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input type="text" placeholder="Search by Address" value={filterPropertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} className="bg-gray-800/70 border border-gray-700 p-2 rounded w-full sm:w-1/3 text-white" />
        <select value={filterPropertyAdType} onChange={(e) => setPropertyAdType(e.target.value)} className="bg-gray-800/70 border border-gray-700 p-2 rounded text-white">
          <option value="">All Ad Types</option> <option value="sale">Sale</option> <option value="rent">Rent</option>
        </select>
        <select value={filterPropertyType} onChange={(e) => setPropertyType(e.target.value)} className="bg-gray-800/70 border-gray-700 p-2 rounded text-white">
          <option value="">All Types</option> <option value="residential">Residential</option> <option value="commercial">Commercial</option> <option value="land/plot">Land/Plot</option>
        </select>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div key={property._id} className="bg-gray-800/70 border-gray-700 rounded-lg shadow-lg hover:shadow-indigo-600/40 transition transform hover:-translate-y-1 overflow-hidden">
              
              {/* IMAGE FIX: Images array + /uploads path */}
              <img
                src={property.images?.[0] ? `${API_URL}/uploads/${property.images[0]}` : "https://picsum.photos/400/300"}
                alt="Property"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-white">{property.address}</h3>
                <p className="text-gray-400 text-sm capitalize">{property.title} - {property.type}</p>
                {loggedIn && (
                  <>
                    <p className="mt-2 text-sm"><b>Owner:</b> {property.owner?.name}</p>
                    <p className="text-sm"><b>Contact:</b> {property.contact}</p>
                    <p className="text-sm"><b>Availability:</b> {property.status}</p>
                    <p className="text-sm"><b>Price:</b> ₹{property.price}</p>
                  </>
                )}
                {property.status === "pending" ? (
                  <button onClick={() => openModal(property)} className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                    {loggedIn ? "Get Info / Book" : "Login to Book"}
                  </button>
                ) : (
                  <p className="mt-2 text-red-400 text-xs">Booked</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">No properties available at the moment.</p>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl relative border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">✖</button>
            <h3 className="text-xl font-bold mb-4 text-white">Property Info</h3>
            
            {/* IMAGE FIX IN MODAL */}
            <img src={selectedProperty.images?.[0] ? `${API_URL}/uploads/${selectedProperty.images[0]}` : "https://via.placeholder.com/400"} alt="Property" className="w-full h-48 object-cover rounded mb-4" />
            
            <div className="space-y-2 text-sm">
              <p><b>Address:</b> {selectedProperty.address}</p>
              <p><b>Title:</b> {selectedProperty.title}</p>
              <p><b>Description:</b> {selectedProperty.description}</p>
              <p><b>For:</b> {selectedProperty.type}</p>
              <p><b>Price:</b> ₹{selectedProperty.price}</p>
              <p><b>Owner Name:</b> {selectedProperty.owner?.name}</p>
              <p><b>Owner Contact:</b> {selectedProperty.contact}</p>
            </div>

            <form className="mt-4 space-y-2" onSubmit={(e) => { e.preventDefault(); handleBooking("pending", selectedProperty._id, selectedProperty.owner._id); }}>
              <input type="text" name="fullName" placeholder="Your Full Name" required value={userDetails.fullName} onChange={(e) => setUserDetails({ ...userDetails, fullName: e.target.value })} className="bg-gray-800 border-gray-700 p-2 w-full rounded text-white" />
              <input type="number" name="phone" placeholder="Phone Number" required value={userDetails.phone} onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })} className="bg-gray-800 border-gray-700 p-2 w-full rounded text-white" />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Book Property</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesCards;