const express = require('express');
const router = express.Router();

// IMP: multerConfig chya jagi cloudinary import kela
const upload = require('../config/cloudinary'); 

const { 
  addProperty, 
  getOwnerProperties, 
  updateProperty, 
  deleteProperty, 
  getOwnerBookings,
  acceptBooking,   
  rejectBooking    
} = require('../controllers/ownerController'); 

const { protect, isOwner } = require('../middleware/authMiddleware');

router.use(protect, isOwner);

router.post('/add-property', upload.single('image'), addProperty); 

router.get('/properties', getOwnerProperties); 
router.get('/bookings', getOwnerBookings);

router.put('/bookings/:id/accept', acceptBooking);
router.put('/bookings/:id/reject', rejectBooking);

router.put('/update-property/:id', upload.single('image'), updateProperty); 

router.delete('/delete-property/:id', deleteProperty);

module.exports = router;