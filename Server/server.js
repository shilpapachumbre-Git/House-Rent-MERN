const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connect");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// 1. BODY PARSER
app.use(express.json()); 


// 2. CORS - FAKT HE
app.use(cors({
  origin: "http://localhost:5174", // React cha exact port
  credentials: true
}));

// 3. STATIC
app.use('/uploads', express.static('uploads'));

// 4. ROUTES
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const adminRoutes = require("./routes/adminRoutes");



app.use("/api/user", userRoutes); 
app.use("/api/owner", ownerRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});