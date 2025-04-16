class AdminController {
    constructor(Booking) {
        this.Booking = Booking;
    }

    async getAllBookings(req, res) {
        try {
            const bookings = await this.Booking.find({});
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving bookings', error });
        }
    }
}

module.exports = AdminController;