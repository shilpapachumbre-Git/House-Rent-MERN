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

router.post("/add-property", protect, isOwner, upload.single("images"), addProperty);
router.get("/properties", protect, isOwner, getOwnerProperties);
router.get("/bookings", protect, isOwner, getOwnerBookings);
router.put("/booking/:id/accept", protect, isOwner, acceptBooking);
router.put("/booking/:id/reject", protect, isOwner, rejectBooking);
router.put("/property/:id", protect, isOwner, upload.array("images", 10), updateProperty);
router.delete("/property/:id", protect, isOwner, deleteProperty);
module.exports = router;