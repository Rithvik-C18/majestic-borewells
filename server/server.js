const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bookingsRouter = require('./controllers/routes/bookings');
const queriesRouter = require('./controllers/routes/queries');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB with retry logic
mongoose.connect("mongodb+srv://user:actdmsx9VovcovuQ@cluster0.aset2rv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Add this before your routes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/queries', queriesRouter);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server time: ${new Date().toISOString()}`);
});
module.exports = app;