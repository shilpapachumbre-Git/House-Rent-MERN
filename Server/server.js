const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken"); // 1. add
const bcrypt = require("bcryptjs"); // 2. add
dotenv.config();

const connectDB = require("./config/connect");
const cloudinary = require("./config/cloudinary");
const User = require("./models/UserSchema"); // 3. add

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json()); 

// CORS
const allowedOrigins = [
  "https://house-rent-mern-client.onrender.com",
  "http://localhost:5174"
];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));

// Token function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ============ AUTH ROUTES ITHECH ============

// @route POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name, 
      email, 
      password, // Schema madhe hash hoil
      role: role || "renter",
      isGranted: role === "owner" ? false : true
    });

    if(user){
      res.status(201).json({
        success: true,
        message: "Registration Successful",
        token: generateToken(user._id),
        user: { 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          isGranted: user.isGranted 
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
});

// @route POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: "Login Successful",
        token: generateToken(user._id),
        user: { 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          isGranted: user.isGranted 
        },
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
});

// ============ BAKI ROUTES ============
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