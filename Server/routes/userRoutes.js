const express = require("express");
const { 
  registerController, 
  loginController, 
  forgotPasswordController, 
  getAllPropertiesController, 
  authController, 
  bookingHandleController, 
  getAllBookingsController,
  getOwnerBookingsController,
  approveBookingController,
  rejectBookingController
} = require("../controllers/userController");

const { protect, isOwner } = require("../middleware/authMiddleware"); 

const router = express.Router();

// Public Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgotpassword", forgotPasswordController);
router.get("/properties", getAllPropertiesController);

// Protected Routes - TENANT
router.get("/me", protect, authController);
router.post("/bookinghandle/:propertyid", protect, bookingHandleController); 
router.get("/mybookings", protect, getAllBookingsController);

// Protected Routes - OWNER
router.get("/owner/bookings", protect, isOwner, getOwnerBookingsController);
router.put("/approve/:id", protect, isOwner, approveBookingController);
router.put("/reject/:id", protect, isOwner, rejectBookingController);

module.exports = router;