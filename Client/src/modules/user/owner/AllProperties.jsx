import { message } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOwnerProperties, updateProperty, deleteProperty } from "../../../api/authApi";

const AllProperties = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({});
  const [allProperties, setAllProperties] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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
    setImagePreview(property.images[0]); 
    setShow(true);
  };

  const getAllProperties = async () => {
    try {
      setLoading(true);
      const res = await getOwnerProperties();
      if (res.data.success) {
        setAllProperties(res.data.properties);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      else message.error("Failed to fetch properties");
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
    setEditingPropertyData((prev) => ({...prev, [e.target.name]: e.target.value }));
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editingPropertyData).forEach(key => formData.append(key, editingPropertyData[key]));
      if (image) formData.append("images", image);

      const res = await updateProperty(editingPropertyId, formData);
      if (res.data.success) {
        message.success("Property updated successfully");
        handleClose();
        getAllProperties();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to save changes");
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure to delete this property?")) {
      try {
        const res = await deleteProperty(propertyId);
        if (res.data.success) {
          message.success("Property deleted");
          getAllProperties();
        }
      } catch (error) {
        message.error("Failed to delete property");
      }
    }
  };

  if(loading) return <div className="text-center py-10 text-gray-400">Loading properties...</div>

  return (
   <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-extrabold text-indigo-400">My Properties</h2>
      <button onClick={() => navigate('/add-property')} className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">
        + Add Property
      </button>
    </div>

    <div className="overflow-x-auto rounded-lg shadow-2xl border-gray-700 bg-gray-900/80">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="bg-indigo-600/80 text-white">
          <tr>
            <th className="px-4 py-3">Image</th><th className="px-4 py-3">Property ID</th><th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Ad Type</th><th className="px-4 py-3">Address</th><th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allProperties.length > 0? allProperties.map((property) => (
            <tr key={property._id} className="border-b border-gray-700 hover:bg-gray-800/60">
              <td className="px-4 py-3"><img src={property.images[0]} alt="" className="h-12 w-12 object-cover rounded"/></td>
              <td className="px-4 py-3 text-xs">{property._id}</td>
              <td className="px-4 py-3 capitalize">{property.title}</td>
              <td className="px-4 py-3 capitalize">{property.type}</td>
              <td className="px-4 py-3">{property.address}</td>
              <td className="px-4 py-3">{property.contact}</td>
              <td className="px-4 py-3 font-semibold text-green-400">₹{property.price?.toLocaleString()}</td>
              <td className={`px-4 py-3 font-bold ${property.status === "approved"? "text-green-400" : "text-yellow-400"}`}>
                {property.status === "approved"? "Available" : "Pending"}
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => handleShow(property)} className="px-3 py-1 text-sm border-indigo-500 text-indigo-400 rounded-lg">Edit</button>
                <button onClick={() => handleDelete(property._id)} className="px-3 py-1 text-sm border border-red-500 text-red-400 rounded-lg">Delete</button>
              </td>
            </tr>
          )) : <tr><td colSpan={9} className="text-center py-6 text-gray-400">No properties found</td></tr>}
        </tbody>
      </table>
    </div>

    {show && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
        <div className="bg-gray-900/90 border-gray-700 text-white w-full max-w-xl p-6 rounded-xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-indigo-400">Edit Property</h3>
          <form onSubmit={saveChanges} className="space-y-4">
            <select name="title" value={editingPropertyData.title} onChange={handleChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg">
              <option value="residential">Residential</option><option value="commercial">Commercial</option><option value="land/plot">Land/Plot</option>
            </select>
            <select name="type" value={editingPropertyData.type} onChange={handleChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg">
              <option value="rent">Rent</option><option value="sale">Sale</option>
            </select>
            <input type="text" name="address" value={editingPropertyData.address} onChange={handleChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
            <input type="text" name="contact" value={editingPropertyData.contact} onChange={handleChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
            <input type="number" name="price" value={editingPropertyData.price} onChange={handleChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
            <textarea name="description" value={editingPropertyData.description} onChange={handleChange} rows={3} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
            <div>
              <label className="text-gray-300">Change Image:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-gray-800/70 border-gray-700 px-3 py-2 rounded-lg"/>
              {imagePreview && <img src={imagePreview} className="h-20 w-20 mt-2 rounded object-cover"/>}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={handleClose} className="px-4 py-2 border-gray-600 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-lg">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
};

export default AllProperties;