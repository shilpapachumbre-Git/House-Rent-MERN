const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  deleteUser, 
  handleStatus, 
  getAllProperties, 
  approveProperty,
  deleteProperty, // <- ADD
  getAllBookings 
} = require('../controllers/adminController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.post('/handlestatus', handleStatus);

router.get('/properties', getAllProperties);
router.put('/properties/approve/:id', approveProperty);
router.delete('/properties/:id', deleteProperty); // <- ADD DELETE ROUTE

router.get('/bookings', getAllBookings);

module.exports = router;