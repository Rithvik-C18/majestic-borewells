const express = require('express');
const router = express.Router();
// Fix path resolution issues - adjust paths based on actual file structure
const BookingsController = require('../../controllers/bookingsController'); // Corrected path
const Booking = require('./booking'); // Corrected path to the model

// Error handling for module imports
try {
    const bookingsController = new BookingsController(Booking); // Instantiate with the model

    // Route to create a new booking with error handling
    router.post('/', async (req, res) => {
        try {
            await bookingsController.createBooking(req, res);
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({ error: 'Failed to create booking', details: error.message });
        }
    });

    // Route to get all bookings with error handling
    router.get('/', async (req, res) => {
        try {
            await bookingsController.getAllBookings(req, res);
        } catch (error) {
            console.error('Error getting bookings:', error);
            res.status(500).json({ error: 'Failed to retrieve bookings', details: error.message });
        }
    });

    // Route to get a booking by ID with error handling
    router.get('/:id', async (req, res) => {
        try {
            await bookingsController.getBookingById(req, res);
        } catch (error) {
            console.error('Error getting booking by ID:', error);
            res.status(500).json({ error: 'Failed to retrieve booking', details: error.message });
        }
    });
} catch (error) {
    console.error('Error initializing booking routes:', error);
    // Fallback routes that return error information
    router.all('*', (req, res) => {
        res.status(500).json({ 
            error: 'Booking system initialization failed', 
            details: error.message,
            path: req.path
        });
    });
}

// Add a diagnostic route to verify the router is working
router.get('/status', (req, res) => {
    res.json({
        status: 'Booking router is operational',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;