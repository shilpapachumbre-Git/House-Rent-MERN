import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../common/Toast";

axios.defaults.withCredentials = true;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [data, setData] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (!data.email ||!data.password ||!data.confirmPassword) {
      showToast("error", "Please fill all fields");
      return;
    }
    if (data.password!== data.confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/forgotpassword`,
        { email: data.email, password: data.password },
        { withCredentials: true }
      );
      if (res.data.success) {
        showToast("success", "Your password has been changed!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast("error", res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        showToast("error", "User doesn't exist");
      } else {
        showToast("error", "Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({...toast, show: false })} />}

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
        <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-md p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500/20 text-3xl shadow-inner">🔑</div>
            <h1 className="text-2xl font-semibold mt-4 text-white">Forgot Password?</h1>
            <p className="text-gray-400 text-sm mt-1">Enter your email and new password to reset</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none" required />
            <input type="password" name="password" value={data.password} onChange={handleChange} placeholder="New Password" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none" required />
            <input type="password" name="confirmPassword" value={data.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none" required />
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-500">
              {loading? "Changing..." : "Change Password"}
            </button>
            <div className="text-center text-gray-400 text-sm mt-4">
              Back to <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;