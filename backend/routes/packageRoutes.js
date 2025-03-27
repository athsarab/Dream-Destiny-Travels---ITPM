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

// Make sure the populate is working correctly for packageId
router.get('/bookings', async (req, res) => {
    try {
        // Use lean() to get plain objects instead of Mongoose documents
        const bookings = await PackageBooking.find()
            .populate('packageId')
            .sort('-createdAt')
            .lean();
            
        // Add safeguard for null packageId
        const safeBookings = bookings.map(booking => {
            if (!booking.packageId) {
                booking.packageId = { name: 'Unknown Package' };
            }
            return booking;
        });
        
        res.json(safeBookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
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
