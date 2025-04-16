const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bookingsRouter = require('./controllers/routes/bookings');
const adminRouter = require('./controllers/routes/admin');
const queriesRouter = require('./controllers/routes/queries');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*', // Consider restricting this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
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
    },
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    heartbeatFrequencyMS: 10000,    // Check server status every 10 seconds
};

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
    console.log('MongoDB connection attempt...');
    mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/majestic_borewells', mongoOptions)
        .then(() => console.log('Connected to MongoDB successfully'))
        .catch(err => {
            console.error('MongoDB connection error:', err);
            console.log('Retrying in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Handle connection errors
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Trying to reconnect...');
    connectWithRetry();
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

// Enhanced API status endpoint with more diagnostic information
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        server: {
            uptime: process.uptime() + ' seconds',
            memory: process.memoryUsage(),
            node: process.version
        },
        database: {
            state: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host || 'not connected',
            name: mongoose.connection.name || 'not connected'
        },
        environment: {
            nodeEnv: process.env.NODE_ENV || 'not set',
            port: process.env.PORT || 3000,
            databaseUrl: process.env.DATABASE_URL ? 'set (hidden)' : 'not set'
        },
        timestamp: new Date().toISOString()
    });
});

// Add a network test endpoint that doesn't require database
app.get('/api/network-test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is reachable',
        timestamp: new Date().toISOString()
    });
});

// Enhance error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Better 404 handling
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server time: ${new Date().toISOString()}`);
    console.log(`View status at: http://localhost:${PORT}/api/status`);
    console.log(`Test network at: http://localhost:${PORT}/api/network-test`);
});

// Add proper server error handling
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please choose another port.`);
    } else {
        console.error('Server failed to start:', error);
    }
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;