import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function AddProperty() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [propertyDetails, setPropertyDetails] = useState({
    title: "residential",
    type: "rent",
    address: "",
    contact: "",
    price: "",
    description: "",
  });
  const navigate = useNavigate();

  // IMP: Fallback takla. Yane undefined cha issue jail
  const API_URL = import.meta.env.VITE_API_URL || "https://house-rent-mern.onrender.com";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      if(file.size > 10 * 1024 * 1024){
        message.error("Image size should be less than 10MB");
        e.target.value = "";
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prev) => ({...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!propertyDetails.address ||!propertyDetails.price ||!propertyDetails.contact) {
      message.error("Please fill Address, Price and Contact");
      setLoading(false);
      return;
    }
    if (!image) {
      message.error("Please upload a property image");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if(!token){
      message.error("Please login first");
      navigate("/login");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", propertyDetails.title);
    formData.append("type", propertyDetails.type);
    formData.append("address", propertyDetails.address);
    formData.append("contact", propertyDetails.contact);
    formData.append("price", propertyDetails.price);
    formData.append("description", propertyDetails.description);
    formData.append("images", image); // Backend madhe "image" aahe ka "images" check kar

    try {
      const res = await axios.post(
        `${API_URL}/api/owner/add-property`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        message.success("Property submitted! Waiting for admin approval.");
        setIsSubmitted(true);

        setPropertyDetails({
          title: "residential",
          type: "rent",
          address: "",
          contact: "",
          price: "",
          description: "",
        });
        setImage(null);
        setImagePreview(null);

        setTimeout(() => {
          navigate("/owner/properties");
        }, 2000);

      } else {
        message.error(res.data.message || "Failed to add property");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      message.error(error.response?.data?.message || "Failed to add property");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-900/80 border-gray-700 backdrop-blur-md shadow-2xl rounded-xl p-8 mt-12 text-white">
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-8 text-center tracking-wide">Add New Property</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-2 text-gray-300">Property Type</label>
            <select name="title" value={propertyDetails.title} onChange={handleChange} required className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500">
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land/plot">Land/Plot</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Property Ad Type</label>
            <select name="type" value={propertyDetails.type} onChange={handleChange} required className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500">
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Property Full Address</label>
            <input type="text" name="address" value={propertyDetails.address} onChange={handleChange} placeholder="Address" required className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"/>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-2 text-gray-300">Property Image</label>
            <input type="file" accept="image/*" required onChange={handleImageChange} className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-2 cursor-pointer text-white file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
            {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 h-24 w-24 object-cover rounded border-gray-600" />}
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Owner Contact No.</label>
            <input type="tel" name="contact" value={propertyDetails.contact} onChange={handleChange} placeholder="9876543210" required className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"/>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Property Amount ₹</label>
            <input type="number" name="price" value={propertyDetails.price} onChange={handleChange} placeholder="50000" required className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"/>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-300">Additional Details</label>
          <textarea name="description" value={propertyDetails.description} onChange={handleChange} rows={4} placeholder="2BHK, 2 Bath, Parking available..." className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"/>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading || isSubmitted}
            className={`font-semibold px-6 py-2 rounded-lg shadow-lg transition duration-200 ${
              isSubmitted? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white disabled:opacity-50`}
          >
            {loading? "Submitting..." : isSubmitted? "Submitted ✅" : "Submit For Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProperty;