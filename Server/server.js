const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connect");
const cloudinary = require("./config/cloudinary"); 

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json()); 


const allowedOrigins = [
  "https://house-rent-mern-client.onrender.com", 
  "http://localhost:5174" 
];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));



// Routes
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/user", userRoutes); 
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running with Cloudinary...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});