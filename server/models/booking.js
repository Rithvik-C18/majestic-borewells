const mongoose = require('mongoose');

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

// Export the model only if it hasn't been compiled yet
module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
