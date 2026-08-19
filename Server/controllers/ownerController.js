const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

// Add Property
exports.addProperty = async (req, res) => {
  try {
    const { title, type, address, price, contact, description } = req.body;

    // IMP: Cloudinary direct URL deto req.file.path madhe
    const imageUrl = req.file? req.file.path : "";

    const property = new Property({
      title,
      type: type.toLowerCase(),
      address,
      price: Number(price),
      description,
      contact,
      owner: req.user.id,
      images: imageUrl? [imageUrl] : [] // filename chya jagi full URL
    });
    await property.save();
    res.status(201).json({ success: true, message: "Property Added", property });
  } catch (err) {
    console.log("Add Property Error:", err);
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

// Get Owner Bookings
exports.getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
     .populate('propertyId', 'title address price images') // images add kela
     .populate('userId', 'name email phone')
     .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.log("Get Bookings Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ACCEPT BOOKING - FIXED
exports.acceptBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id).populate('propertyId');

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.propertyId.owner.toString()!== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (booking.bookingStatus!== 'pending') {
      return res.status(400).json({ success: false, message: "Booking already processed" });
    }

    booking.bookingStatus = 'approved';
    await booking.save();

    booking = await Booking.findById(req.params.id)
     .populate('propertyId', 'title address price images') // images add kela
     .populate('userId', 'name phone');

    res.status(200).json({ success: true, message: "Booking Accepted", booking });
  } catch (err) {
    console.log("Accept Booking Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// REJECT BOOKING - FIXED
exports.rejectBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id).populate('propertyId');

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.propertyId.owner.toString()!== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (booking.bookingStatus!== 'pending') {
      return res.status(400).json({ success: false, message: "Booking already processed" });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    booking = await Booking.findById(req.params.id)
     .populate('propertyId', 'title address price images') // images add kela
     .populate('userId', 'name phone');

    res.status(200).json({ success: true, message: "Booking Rejected", booking });
  } catch (err) {
    console.log("Reject Booking Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit Property
exports.updateProperty = async (req, res) => {
  try {
    let updateData = {...req.body };
    if(req.file){
      // IMP: Edit kartana pan Cloudinary URL
      updateData.images = [req.file.path];
    }
    if(updateData.price) updateData.price = Number(updateData.price);
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