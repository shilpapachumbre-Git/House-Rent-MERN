const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const { 
  addProperty, 
  getOwnerProperties, 
  updateProperty, 
  deleteProperty, 
  getOwnerBookings,
  acceptBooking,   // <-- NEW
  rejectBooking    // <-- NEW
} = require('../controllers/ownerController'); // controller cha nav 'ownerController' aahe
const { protect, isOwner } = require('../middleware/authMiddleware');

router.use(protect, isOwner);

// FIX 1: 'images' kel karan frontend tithech pathavtoy
router.post('/add-property', upload.single('images'), addProperty); 

router.get('/properties', getOwnerProperties); // Frontend yach URL la hit karel
router.get('/bookings', getOwnerBookings);

// NEW: Accept / Reject Routes
router.put('/bookings/:id/accept', acceptBooking);
router.put('/bookings/:id/reject', rejectBooking);

// FIX 2: update madhe pan 'images'
router.put('/update-property/:id', upload.single('images'), updateProperty); 

router.delete('/delete-property/:id', deleteProperty);

module.exports = router;