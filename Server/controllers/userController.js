const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. REGISTER
exports.registerController = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role, phone });
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. LOGIN 
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. GET LOGGED IN USER DATA
exports.authController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. GET ALL PROPERTIES - Public
exports.getAllPropertiesController = async (req, res) => {
  try {
    const properties = await Property.find({}).populate("owner", "name phone");
    res.status(200).json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. BOOK PROPERTY
exports.bookingHandleController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const { ownerId, startDate, endDate, phone } = req.body;

    const booking = await Booking.create({
      propertyId: propertyid,
      userId: req.user.id,        
      userName: req.user.name,    
      ownerId,
      startDate,
      endDate,
      phone,
      bookingStatus: "pending"
    });
    res.status(201).json({ success: true, message: "Booking request sent" });
  } catch (error) {
    console.log("Booking Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. GET MY BOOKINGS - FIXED ✅
exports.getAllBookingsController = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }) 
      .populate("propertyId") // full property data
      .populate("ownerId", "name email phone") // owner details
      .populate("userId", "name phone"); // tenant details add kele - yachyamule phone disnar
    
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 7. FORGOT PASSWORD - TEMP
exports.forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};