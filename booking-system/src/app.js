const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bookingsRouter = require('./routes/bookings');
const adminRouter = require('./routes/admin');
const queriesRouter = require('./routes/queries');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from project root for main HTML files
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '../..')));

// Serve static files from 'views' directory for admin panel
app.use('/admin', express.static(path.join(__dirname, 'views')));

// MongoDB connection options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
    }
};

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/majestic_borewells', mongoOptions)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Handle connection errors
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Trying to reconnect...');
});

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/queries', queriesRouter);
app.use('/admin', adminRouter);

// Serve admin.html at /admin endpoint
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Root route - serve home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'home.html'));
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;