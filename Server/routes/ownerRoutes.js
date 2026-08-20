const express = require("express");
const { protect, isOwner } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig"); 
const { 
    addProperty, 
    getOwnerProperties, 
    getOwnerBookings, 
    acceptBooking, 
    rejectBooking, 
    updateProperty, 
    deleteProperty 
} = require("../controllers/ownerController");

const router = express.Router();

// @route   POST /api/owner/add-property
// @desc    Add new property
router.post("/add-property", protect, isOwner, upload.single("images", 10), addProperty);

// @route   GET /api/owner/properties  
// @desc    Get all properties of logged in owner
router.get("/properties", protect, isOwner, getOwnerProperties);

// @route   GET /api/owner/bookings
// @desc    Get all bookings for owner's properties
router.get("/bookings", protect, isOwner, getOwnerBookings);

// @route   PUT /api/owner/booking/:id/accept
// @desc    Accept a booking
router.put("/booking/:id/accept", protect, isOwner, acceptBooking);

// @route   PUT /api/owner/booking/:id/reject
// @desc    Reject a booking
router.put("/booking/:id/reject", protect, isOwner, rejectBooking);

// @route   PUT /api/owner/property/:id
// @desc    Update property
router.put("/property/:id", protect, isOwner, upload.array("images", 10), updateProperty);

// @route   DELETE /api/owner/property/:id
// @desc    Delete property
router.delete("/property/:id", protect, isOwner, deleteProperty);

module.exports = router;