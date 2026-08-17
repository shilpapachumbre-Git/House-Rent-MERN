import axios from "axios"; 

const API = axios.create({
  baseURL: "http://localhost:5000",
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => API.post("/api/user/login", data);
export const register = (data) => API.post("/api/user/register", data);
export const getUserData = () => API.get("/api/user/me");


export const addProperty = (formData) => 
  API.post("/api/owner/add-property", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getOwnerProperties = () => API.get("/api/owner/my-properties");

export default API;