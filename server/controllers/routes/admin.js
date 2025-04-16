const express = require('express');
const router = express.Router();
const AdminController = require('../adminController');
const Booking = require('./models/booking');

const adminController = new AdminController(Booking);

router.get('/bookings', adminController.getAllBookings.bind(adminController));

module.exports = router;