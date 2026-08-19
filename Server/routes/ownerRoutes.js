const express = require('express');
const router = express.Router();

// IMP: cloudinary + multer config
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

// CHANGE: single('image') -> array('images', 5)
router.post('/add-property', upload.array('images', 5), addProperty);

router.get('/properties', getOwnerProperties);
router.get('/bookings', getOwnerBookings);

router.put('/bookings/:id/accept', acceptBooking);
router.put('/bookings/:id/reject', rejectBooking);

// CHANGE: single('image') -> array('images', 5)
router.put('/update-property/:id', upload.array('images', 5), updateProperty);

router.delete('/delete-property/:id', deleteProperty);

module.exports = router;