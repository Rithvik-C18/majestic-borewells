const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Query Schema
const querySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    query: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleString() },
    status: { type: String, default: 'pending', enum: ['pending', 'in-progress', 'completed'] }
});

// Check if model already exists to prevent overwriting
const Query = mongoose.models.Query || mongoose.model('Query', querySchema);

// Get all queries
router.get('/', async (req, res) => {
    try {
        const queries = await Query.find().sort({ date: -1 });
        res.json(queries);
    } catch (err) {
        console.error('Error fetching queries:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new query
router.post('/', async (req, res) => {
    try {
        const newQuery = new Query(req.body);
        const savedQuery = await newQuery.save();
        res.status(201).json(savedQuery);
    } catch (err) {
        console.error('Error saving query:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update query status
router.patch('/:id', async (req, res) => {
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

// Delete query
router.delete('/:id', async (req, res) => {
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

module.exports = router; 