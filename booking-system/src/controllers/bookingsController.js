class BookingsController {
    constructor(bookingModel) {
        this.Booking = bookingModel;
        
        // Bind methods to this instance
        this.createBooking = this.createBooking.bind(this);
        this.getAllBookings = this.getAllBookings.bind(this);
        this.getBookingById = this.getBookingById.bind(this);
    }

    async createBooking(req, res) {
        try {
            const newBooking = new this.Booking(req.body);
            const savedBooking = await newBooking.save();
            res.status(201).json(savedBooking);
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: 'Validation Error', details: error.message });
            }
            res.status(500).json({ error: 'Server Error', details: error.message });
        }
    }

    async getAllBookings(req, res) {
        try {
            const bookings = await this.Booking.find().sort({ createdAt: -1 });
            res.json(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Server Error', details: error.message });
        }
    }

    async getBookingById(req, res) {
        try {
            const booking = await this.Booking.findById(req.params.id);
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            res.json(booking);
        } catch (error) {
            console.error('Error fetching booking by ID:', error);
            if (error.kind === 'ObjectId') {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            res.status(500).json({ error: 'Server Error', details: error.message });
        }
    }
}

module.exports = BookingsController;