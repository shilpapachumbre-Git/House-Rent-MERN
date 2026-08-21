const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.addProperty = async (req, res) => {
  try {
    console.log("=== ADD PROPERTY CALLED ===");
    const { title, type, address, price, contact, description } = req.body;
    const imageUrl = req.file? req.file.path : "";

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const property = new Property({
      title,
      type: type.toLowerCase(),
      address,
      price: Number(price),
      description,
      contact,
      owner: req.user.id,
      images: [imageUrl]
    });
    await property.save();
    res.status(201).json({ success: true, message: "Property Added", property });
  } catch (err) {
    console.log("Add Property Error:", err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Owner Properties
exports.getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
  .populate('propertyId', 'title address price images')
  .populate('userId', 'name email phone') // <- yachyamule phone yeto
  .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.log("Get Bookings Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ACCEPT BOOKING - junya status sathi fallback add kela
exports.acceptBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id).populate('propertyId');

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.propertyId.owner.toString()!== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const currentStatus = booking.bookingStatus || booking.status; // <- fallback
    if (currentStatus!== 'pending') {
      return res.status(400).json({ success: false, message: "Booking already processed" });
    }

    booking.bookingStatus = 'approved';
    await booking.save();

    booking = await Booking.findById(req.params.id)
  .populate('propertyId', 'title address price images')
  .populate('userId', 'name phone');

    res.status(200).json({ success: true, message: "Booking Accepted", booking });
  } catch (err) {
    console.log("Accept Booking Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// REJECT BOOKING - junya status sathi fallback add kela
exports.rejectBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id).populate('propertyId');

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.propertyId.owner.toString()!== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const currentStatus = booking.bookingStatus || booking.status; // <- fallback
    if (currentStatus!== 'pending') {
      return res.status(400).json({ success: false, message: "Booking already processed" });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    booking = await Booking.findById(req.params.id)
  .populate('propertyId', 'title address price images')
  .populate('userId', 'name phone');

    res.status(200).json({ success: true, message: "Booking Rejected", booking });
  } catch (err) {
    console.log("Reject Booking Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit Property - FIX: req.files -> req.file
exports.updateProperty = async (req, res) => {
  try {
    let updateData = {...req.body };
    if (req.file) { // <- ITHE FIX KELA. single file sathi req.file
      updateData.images = [req.file.path];
    }
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.type) updateData.type = updateData.type.toLowerCase();

    const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ success: true, message: "Property Updated", property });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    await Booking.deleteMany({ propertyId: req.params.id });
    res.status(200).json({ success: true, message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};