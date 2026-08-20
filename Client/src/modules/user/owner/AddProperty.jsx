import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../../../api/api"; // FIXED PATH

function AddProperty() {
  const [images, setImages] = useState([]); // array kela multiple sathi
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [propertyDetails, setPropertyDetails] = useState({
    title: "residential",
    type: "rent",
    address: "",
    contact: "",
    price: "",
    description: "",
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // multiple files
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    if(validFiles.length !== files.length){
      message.error("Some images > 10MB. Max 10MB per image");
    }

    setImages(validFiles);
    setImagePreviews(validFiles.map(file => URL.createObjectURL(file)));
  };

  const handleChange = (e) => {
    setPropertyDetails((prev) => ({...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!propertyDetails.address ||!propertyDetails.price ||!propertyDetails.contact || images.length === 0) {
      message.error("Please fill all required fields + Upload at least 1 image");
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
    
    images.forEach((img) => { // multiple images append
      formData.append("images", img);
    });

    try {
      const res = await addProperty(formData);
      if(res.data.success){
        message.success("Property submitted! Waiting for admin approval. ✅");
        setTimeout(() => navigate("/owner"), 1500);
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900/80 border border-gray-700 backdrop-blur-md shadow-2xl rounded-xl p-8 text-white">
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-8 text-center">Add New Property</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <select name="title" value={propertyDetails.title} onChange={handleChange} className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-3">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land/plot">Land/Plot</option>
          </select>

          <select name="type" value={propertyDetails.type} onChange={handleChange} className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-3">
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>

          <input type="text" name="address" value={propertyDetails.address} onChange={handleChange} placeholder="Full Address *" required className="w-full bg-gray-800/80 border-gray-700 rounded-lg px-3 py-3 placeholder-gray-400"/>
          <input type="tel" name="contact" value={propertyDetails.contact} onChange={handleChange} placeholder="Contact No *" required className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-3 placeholder-gray-400"/>
          <input type="number" name="price" value={propertyDetails.price} onChange={handleChange} placeholder="Price ₹ *" required className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-3 placeholder-gray-400"/>

          <div>
            <input type="file" name="images" accept="image/*" multiple required onChange={handleImageChange} className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 file:bg-indigo-600 file:text-white"/>
            <div className="flex gap-2 mt-2 flex-wrap">
              {imagePreviews.map((src, i) => <img key={i} src={src} alt="preview" className="h-20 w-20 object-cover rounded" />)}
            </div>
          </div>
        </div>

        <textarea name="description" value={propertyDetails.description} onChange={handleChange} rows={4} placeholder="Additional Details..." className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-3 placeholder-gray-400"/>

        <button type="submit" disabled={loading} className="w-full font-semibold py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition">
          {loading? "Submitting..." : "Submit For Approval"}
        </button>
      </form>
    </div>
  );
}

export default AddProperty;