import { message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllProperties = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({});
  const [allProperties, setAllProperties] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  const handleClose = () => {
    setShow(false);
    setImage(null);
    setImagePreview(null);
  };

  const handleShow = (property) => {
    setEditingPropertyId(property._id);
    setEditingPropertyData({
      title: property.title,
      type: property.type,
      address: property.address,
      contact: property.contact,
      price: property.price,
      description: property.description,
    });
    setImagePreview(`${API_URL}/uploads/${property.images[0]}`);
    setShow(true);
  };

  const getAllProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if(!token){
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/api/owner/properties`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAllProperties(response.data.properties);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        message.error("Session expired, please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch properties");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllProperties(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingPropertyData((prev) => ({...prev, [name]: value }));
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", editingPropertyData.title);
      formData.append("type", editingPropertyData.type);
      formData.append("address", editingPropertyData.address);
      formData.append("contact", editingPropertyData.contact);
      formData.append("price", editingPropertyData.price);
      formData.append("description", editingPropertyData.description);
      if (image) formData.append("images", image);

      const res = await axios.put(
        `${API_URL}/api/owner/update-property/${editingPropertyId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        message.success("Property updated successfully");
        handleClose();
        getAllProperties();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to save changes");
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `${API_URL}/api/owner/delete-property/${propertyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          message.success("Property deleted");
          getAllProperties();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        message.error("Failed to delete property");
      }
    }
  };

  if(loading) return <div className="text-center py-10 text-gray-400">Loading properties...</div>

  return (
   <div className="p-6 bg-gray-900 min-h-screen">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-extrabold text-indigo-400">My Properties</h2>
      <button
        onClick={() => navigate('/add-property')}
        className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        + Add Property
      </button>
    </div>

  <div className="overflow-x-auto rounded-lg shadow-2xl border-gray-700 bg-gray-900/80 backdrop-blur-md">
    <table className="w-full text-sm text-left text-gray-300">
      <thead className="bg-indigo-600/80 text-white">
        <tr>
          <th className="px-4 py-3">Image</th>
          <th className="px-4 py-3">Property ID</th>
          <th className="px-4 py-3 text-center">Property Type</th>
          <th className="px-4 py-3 text-center">Ad Type</th>
          <th className="px-4 py-3 text-center">Address</th>
          <th className="px-4 py-3 text-center">Owner Contact</th>
          <th className="px-4 py-3 text-center">Amount</th>
          <th className="px-4 py-3 text-center">Availability</th>
          <th className="px-4 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {allProperties.length > 0? allProperties.map((property) => (
          <tr key={property._id} className="border-b border-gray-700 hover:bg-gray-800/60">
            <td className="px-4 py-3">
              <img src={`${API_URL}/uploads/${property.images[0]}`} alt="" className="h-12 w-12 object-cover rounded"/>
            </td>
            <td className="px-4 py-3">{property._id}</td>
            <td className="px-4 py-3 text-center capitalize">{property.title}</td>
            <td className="px-4 py-3 text-center capitalize">{property.type}</td>
            <td className="px-4 py-3 text-center">{property.address}</td>
            <td className="px-4 py-3 text-center">{property.contact}</td>
            <td className="px-4 py-3 text-center font-semibold text-green-400">₹{property.price?.toLocaleString()}</td>
            <td className={`px-4 py-3 text-center font-bold ${
              property.status === "approved"? "text-green-400" : "text-yellow-400"
            }`}>
              {property.status === "approved"? "Available" : "Pending"}
            </td>
            <td className="px-4 py-3 flex gap-2 justify-center">
              <button onClick={() => handleShow(property)} className="px-3 py-1 text-sm border border-indigo-500 text-indigo-400 rounded-lg hover:bg-indigo-500/20">Edit</button>
              <button onClick={() => handleDelete(property._id)} className="px-3 py-1 text-sm border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20">Delete</button>
            </td>
          </tr>
        )) : <tr><td colSpan={9} className="text-center py-6 text-gray-400">No properties found</td></tr>}
      </tbody>
    </table>
  </div>

  {/* Edit Modal */}
  {show && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-900/90 border border-gray-700 text-white w-full max-w-xl p-6 rounded-xl shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-indigo-400">Edit Property</h3>
        <form onSubmit={saveChanges} className="space-y-4">
          <select name="title" value={editingPropertyData.title} onChange={handleChange} className="w-full bg-gray-800/70 border border-gray-700 px-3 py-2 rounded-lg">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land/plot">Land/Plot</option>
          </select>
          <select name="type" value={editingPropertyData.type} onChange={handleChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg">
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
          <input type="text" name="address" value={editingPropertyData.address} onChange={handleChange} placeholder="Address" className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
          <input type="text" name="contact" value={editingPropertyData.contact} onChange={handleChange} placeholder="Contact" className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
          <input type="number" name="price" value={editingPropertyData.price} onChange={handleChange} placeholder="Price" className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
          <textarea name="description" value={editingPropertyData.description} onChange={handleChange} rows={3} placeholder="Description" className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>

          <div>
            <label className="text-gray-300">Change Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg file:bg-indigo-600"/>
            {imagePreview && <img src={imagePreview} className="h-20 w-20 mt-2 rounded object-cover"/>}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 border-gray-600 rounded-lg hover:bg-gray-700/50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
};

export default AllProperties;