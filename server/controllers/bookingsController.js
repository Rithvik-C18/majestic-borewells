class BookingsController {
    constructor(BookingModel) {
        this.Booking = BookingModel;
    }

    async createBooking(req, res) {
        try {
            const { date, time, service } = req.body;
            const selectedDateTime = new Date(`${date}T${time}`);
            
            // Calculate 6 hours before and after in milliseconds
            const sixHours = 6 * 60 * 60 * 1000;
            const sixHoursBefore = new Date(selectedDateTime.getTime() - sixHours);
            const sixHoursAfter = new Date(selectedDateTime.getTime() + sixHours);

            // Check for any booking in the 6-hour window before or after
            const conflictingBooking = await this.Booking.findOne({
                service,
                date: date,
                time: {
                    $gte: sixHoursBefore.toTimeString().slice(0, 5),
                    $lte: sixHoursAfter.toTimeString().slice(0, 5)
                }
            });

            if (conflictingBooking) {
                return res.status(409).json({ 
                    message: `Cannot book this service. There is an existing booking at ${conflictingBooking.time}. Must maintain a 6-hour gap between bookings of the same service.`
                });
            }

            // If no conflicts, create the booking
            const booking = new this.Booking(req.body);
            await booking.save();
            res.status(201).json({ bookingId: booking._id });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllBookings(req, res) {
        try {
            const bookings = await this.Booking.find();
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getBookingById(req, res) {
        try {
            const booking = await this.Booking.findById(req.params.id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = BookingsController;