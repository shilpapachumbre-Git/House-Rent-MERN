const express = require("express");
const { 
  forgotPasswordController, 
  getAllPropertiesController, 
  authController, 
  bookingHandleController, 
  getAllBookingsController
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware"); 

const router = express.Router();

// Public Routes
router.post("/forgotpassword", forgotPasswordController);
router.get("/properties", getAllPropertiesController);

// Protected Routes
router.get("/me", protect, authController);
router.post("/bookinghandle/:propertyid", protect, bookingHandleController); 
router.get("/bookings", protect, getAllBookingsController);

module.exports = router;