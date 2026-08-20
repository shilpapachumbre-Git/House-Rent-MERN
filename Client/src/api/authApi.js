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
  API.post("/api/owner/add-property", formData); // <- header kadhla

export const getOwnerProperties = () => API.get("/api/owner/properties");
export const getOwnerBookings = () => API.get("/api/owner/bookings");
export const acceptBooking = (id) => API.put(`/api/owner/booking/${id}/accept`);
export const rejectBooking = (id) => API.put(`/api/owner/booking/${id}/reject`);

export const updateProperty = (id, formData) => 
  API.put(`/api/owner/property/${id}`, formData); // <- ithun pan kadhla

export const deleteProperty = (id) => API.delete(`/api/owner/property/${id}`);

export default API;