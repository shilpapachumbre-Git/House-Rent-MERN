import { register } from "../../api/authApi";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../common/Toast";

axios.defaults.withCredentials = true;

const Register = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name ||!data.email ||!data.password ||!data.role) {
      return showToast("error", "Please fill all fields");
    }

    setLoading(true);
    try {
      const response = await register(data);

      // FIX: success check karnyaivaji message check kela
      if (response.data.message) {
        showToast("success", response.data.message); // "User created successfully"
        setTimeout(() => navigate("/login"), 1000);
      } else {
        showToast("error", "Registration failed");
      }
    } catch (error) {
      console.log("Register Error:", error.response?.data);
      showToast("error", error.response?.data?.message || error.response?.data?.error || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex-col">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({...toast, show: false })} />}

      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg shadow-md py-4 px-8 flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-indigo-400 tracking-wide">RentEase</h2>
        <div className="space-x-8 text-lg">
          <Link to="/" className="text-gray-200 hover:text-indigo-400 transition">Home</Link>
          <Link to="/login" className="text-gray-200 hover:text-indigo-400 transition">Login</Link>
          <Link to="/register" className="text-black bg-indigo-400 px-4 py-2 rounded-lg shadow hover:bg-indigo-500 transition">Register</Link>
        </div>
      </nav>

      <div className="flex-grow flex justify-center items-center px-4 pt-20">
        <div className="bg-gray-900/80 border-gray-700 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-3xl font-bold shadow-inner">📝</div>
            <h1 className="text-2xl font-semibold mt-4 text-white">Sign Up</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="Renter Full Name / Owner Name" className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" required />
            <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" required />
            <input type="password" name="password" value={data.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" required />

            <select name="role" value={data.role} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" required>
              <option value="">Select User Type</option>
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 disabled:bg-gray-500">
              {loading? "Signing Up..." : "Sign Up"}
            </button>

            <div className="text-center text-red-400 text-sm mt-4">
              Have an account? <Link to="/login" className="text-indigo-400 hover:underline">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;