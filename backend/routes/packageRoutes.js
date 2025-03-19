const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const PackageBooking = require('../models/PackageBooking');
const {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage
} = require('../controllers/packageController');

// Debug middleware
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Booking routes should come before /:id routes to avoid conflict
router.post('/bookings', async (req, res) => {
    try {
        console.log('Received booking data:', req.body); // Debug log
        const booking = new PackageBooking(req.body);
        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Booking error:', error);
        res.status(400).json({ message: error.message });
    }
});

router.get('/bookings', async (req, res) => {
    try {
        const bookings = await PackageBooking.find()
            .populate('packageId')
            .sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/bookings/:id', async (req, res) => {
    try {
        const booking = await PackageBooking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Package routes
router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/', upload.single('image'), createPackage);
router.put('/:id', upload.single('image'), updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;
