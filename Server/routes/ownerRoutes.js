const express = require("express");
const { protect, isOwner } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig"); // 1. he fix kela
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

// KEY CHANGE: upload.array kela aahe
router.post("/add-property", protect, isOwner, upload.array("images", 1), addProperty);
router.get("/my-properties", protect, isOwner, getOwnerProperties);
router.get("/my-bookings", protect, isOwner, getOwnerBookings);
router.put("/booking/:id/accept", protect, isOwner, acceptBooking);
router.put("/booking/:id/reject", protect, isOwner, rejectBooking);
router.put("/property/:id", protect, isOwner, upload.array("images", 1), updateProperty);
router.delete("/property/:id", protect, isOwner, deleteProperty);

module.exports = router;