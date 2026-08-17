const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

// View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Handle Owner Grant/Ungrant
exports.handleStatus = async (req, res) => {
  try {
    const { userid, status } = req.body; // status = true/false
    await User.findByIdAndUpdate(userid, { isGranted: status });
    res.status(200).json({ success: true, message: "Owner status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Manage properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.status(200).json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve Property
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id, 
      { status: 'approved' }, // <- lowercase kela, DB shi match honya sathi
      { new: true }
    );
    if(!property) return res.status(404).json({success: false, message: "Property not found"})
    res.status(200).json({ success: true, message: "Property Approved", property });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE PROPERTY <- ADD KEL
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if(!property){
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Jar uploads folder madhun image pan delete karaychi asel tar
    // const fs = require('fs');
    // property.images.forEach(img => {
    //   fs.unlinkSync(`uploads/${img}`);
    // });

    await Property.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Manage bookings - FIXED
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("ownerId", "name email")
      .populate("propertyId", "title address price"); // <- Schema pramane change kela
    
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};