const express = require("express");
const { 
  registerController, 
  loginController, 
  forgotPasswordController, 
  getAllPropertiesController, 
  authController, 
  bookingHandleController, 
  getAllBookingsController // <-- controller madhe he nav aahe
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware"); 

const router = express.Router();

// Public Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgotpassword", forgotPasswordController);
router.get("/properties", getAllPropertiesController);

// Protected Routes
router.get("/me", protect, authController);
router.post("/bookinghandle/:propertyid", protect, bookingHandleController); 
router.get("/bookings", protect, getAllBookingsController); // <-- Frontend pan yach URL la hit karel

module.exports = router;