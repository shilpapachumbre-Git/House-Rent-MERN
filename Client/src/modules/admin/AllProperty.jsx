import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const AllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const API_URL = import.meta.env.VITE_API_URL || "https://house-rent-mern.onrender.com";

  const getAllProperty = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if(!token){
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/properties`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAllProperties(response.data.properties);
      } else {
        message.error(response.data.message || "Unauthorized access");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to fetch Property");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/admin/properties/approve/${id}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.data.success){
        message.success("Property Approved");
        getAllProperty();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Approve failed");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure to delete this property?")){
      try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(
          `${API_URL}/api/admin/properties/${id}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if(res.data.success){
          message.success("Property Deleted");
          getAllProperty();
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  useEffect(() => { getAllProperty(); }, []);

  if(loading) return <div className="text-center py-10 text-gray-400">Loading properties...</div>

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-4">All Properties</h2>
      <div className="rounded-xl overflow-hidden border-gray-700 bg-gray-900/80 backdrop-blur-md shadow-2xl">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-indigo-600/80 text-white">
            <tr>
              <th className="py-3 px-4">Property ID</th>
              <th className="py-3 px-4 text-center">Property Type</th>
              <th className="py-3 px-4 text-center">Ad Type</th>
              <th className="py-3 px-4 text-center">Address</th>
              <th className="py-3 px-4 text-center">Owner Contact</th>
              <th className="py-3 px-4 text-center">Amount</th>
              <th className="py-3 px-4 text-center">Availability</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProperties.length > 0 ? (
              allProperties.map((property) => (
                <tr key={property._id} className="border-b border-gray-700 hover:bg-indigo-500/10">
                  <td className="py-2 px-4">{property._id}</td>
                  <td className="py-2 px-4 text-center capitalize">{property.title}</td>
                  <td className="py-2 px-4 text-center capitalize">{property.type}</td>
                  <td className="py-2 px-4 text-center">{property.address}</td>
                  <td className="py-2 px-4 text-center">{property.contact || property.owner?.phone || "N/A"}</td>
                  <td className="py-2 px-4 text-center font-semibold text-green-400">₹{property.price?.toLocaleString()}</td>
                  
                  <td className={`py-2 px-4 text-center font-bold ${
                    property.status === 'approved' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {property.status === 'approved' ? 'Available' : 'Pending'}
                  </td>

                  <td className="py-2 px-4 text-center space-x-2">
                    {property.status !== 'approved' && (
                      <button 
                        onClick={() => handleApprove(property._id)}
                        className="px-3 py-1 border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/20 text-sm"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(property._id)}
                      className="px-3 py-1 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center py-6 text-gray-400">No properties found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProperty;