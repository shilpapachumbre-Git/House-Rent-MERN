import axios from "axios"; 

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://house-rent-mern.onrender.com",
  withCredentials: true 
});

// Token automatic add hoil
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// USER
export const login = (data) => API.post("/api/user/login", data);
export const register = (data) => API.post("/api/user/register", data);
export const getUserData = () => API.get("/api/user/me");

// OWNER
export const addProperty = (formData) => 
  API.post("/api/owner/add-property", formData, {
    headers: { "Content-Type": "multipart/form-data" } // HE THEV. Nahi tar image jananar nahi
  });

export const getOwnerProperties = () => API.get("/api/owner/my-properties");
export const getOwnerBookings = () => API.get("/api/owner/bookings");
export const acceptBooking = (id) => API.put(`/api/owner/booking/${id}/accept`);
export const rejectBooking = (id) => API.put(`/api/owner/booking/${id}/reject`);

export default API;