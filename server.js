const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/majestic_borewells', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Define schemas
const querySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    query: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleString() },
    status: { type: String, default: 'pending', enum: ['pending', 'in-progress', 'completed'] }
});

const bookingSchema = new mongoose.Schema({
    address: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    service: { type: String, required: true },
});

// Create models
const Query = mongoose.model('Query', querySchema);
const Booking = mongoose.model('Booking', bookingSchema);

// API Routes for Queries
app.get('/api/queries', async (req, res) => {
    try {
        const queries = await Query.find().sort({ date: -1 });
        res.json(queries);
    } catch (err) {
        console.error('Error fetching queries:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/queries', async (req, res) => {
    try {
        const newQuery = new Query(req.body);
        const savedQuery = await newQuery.save();
        res.status(201).json(savedQuery);
    } catch (err) {
        console.error('Error saving query:', err);
        res.status(400).json({ message: err.message });
    }
});

app.patch('/api/queries/:id', async (req, res) => {
    try {
        const updatedQuery = await Query.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        if (!updatedQuery) {
            return res.status(404).json({ message: 'Query not found' });
        }
        
        res.json(updatedQuery);
    } catch (err) {
        console.error('Error updating query:', err);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/queries/:id', async (req, res) => {
    try {
        const query = await Query.findByIdAndDelete(req.params.id);
        
        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }
        
        res.json({ message: 'Query deleted' });
    } catch (err) {
        console.error('Error deleting query:', err);
        res.status(500).json({ message: err.message });
    }
});

// API Routes for Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: -1 });
        res.json(bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        res.status(201).json({ 
            message: 'Booking created successfully', 
            bookingId: savedBooking._id 
        });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(400).json({ message: err.message });
    }
});

// Serve main HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 