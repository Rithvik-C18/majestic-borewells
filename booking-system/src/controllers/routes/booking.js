const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true,
        enum: ['sensor', 'robo', '6 and half']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);