const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define booking schema
const bookingSchema = new mongoose.Schema({
    address: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    service: { 
        type: String, 
        required: true,
        enum: ['sensor', 'robo', 'direct'] 
    },
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// Create a new booking
router.post('/', async (req, res) => {
    try {
        console.log('Received booking request:', req.body);
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        console.log('Booking saved successfully:', savedBooking._id);
        res.status(201).json({ 
            success: true, 
            message: 'Booking created successfully', 
            bookingId: savedBooking._id 
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create booking', 
            error: error.message 
        });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch bookings', 
            error: error.message 
        });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch booking', 
            error: error.message 
        });
    }
});

// Add a diagnostic route
router.get('/test/connection', (req, res) => {
    res.json({
        success: true,
        message: 'Booking API is operational',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;