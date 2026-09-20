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
  const [menuOpen, setMenuOpen] = useState(false);
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
      if (response.data.message || response.data.success) {
        showToast("success", response.data.message || "Registered successfully");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        showToast("error", "Registration failed");
      }
    } catch (error) {
      console.log("Register Error:", error.response?.data);
      showToast("error", error.response?.data?.message || error.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({...toast, show: false })} />}

      {/* Navbar FIX */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg shadow-md py-4 px-4 md:px-8 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-400 tracking-wide">RentEase</h2>

        <div className="hidden md:flex space-x-8 text-lg items-center">
          <Link to="/" className="text-gray-200 hover:text-indigo-400 transition">Home</Link>
          <Link to="/login" className="text-gray-200 hover:text-indigo-400 transition">Login</Link>
          <Link to="/register" className="text-black bg-indigo-400 px-4 py-2 rounded-lg shadow hover:bg-indigo-500 transition">Register</Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-3xl">
          {menuOpen? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed top-[65px] left-0 w-full z-40 bg-black/95 md:hidden flex flex-col gap-4 p-6 border-t border-gray-800">
          <Link to="/" onClick={()=>setMenuOpen(false)} className="text-gray-200 py-2">Home</Link>
          <Link to="/login" onClick={()=>setMenuOpen(false)} className="text-gray-200 py-2">Login</Link>
          <Link to="/register" onClick={()=>setMenuOpen(false)} className="bg-indigo-400 text-black px-4 py-2 rounded-lg w-fit">Register</Link>
        </div>
      )}

      <div className="flex-grow flex justify-center items-center px-4 pt-24 pb-10">
        <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-md p-6 md:p-8 mt-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500/20 text-3xl shadow-inner">📝</div>
            <h1 className="text-2xl font-semibold mt-4 text-white">Sign Up</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
            <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
            <input type="password" name="password" value={data.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
            <select name="role" value={data.role} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
              <option value="">Select User Type</option>
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-600">
              {loading? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-center text-gray-400 text-sm mt-4">
              Have an account? <Link to="/login" className="text-indigo-400 hover:underline">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;