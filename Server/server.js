const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connect");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json()); 

// CORS - Render + Localhost donhila permission
const allowedOrigins = [
  "https://house-rent-mern-client.onrender.com", // Render varcha Client URL
  "http://localhost:5174" // Local testing sathi
];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/user", userRoutes); 
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});