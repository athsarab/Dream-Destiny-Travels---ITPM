const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Package = require('../models/Package');
const PackageBooking = require('../models/PackageBooking');
const upload = require('../middleware/upload');
const {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage
} = require('../controllers/packageController');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Debug middleware - Keep only one instance
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} [DEBUG] ${req.method} ${req.originalUrl}`);
    next();
});

// Add specific debug route to test if the router is properly mounted
router.get('/debug', (req, res) => {
    res.status(200).json({
        message: 'Package routes are working',
        availableEndpoints: {
            bookings: 'GET, POST, PUT /bookings/:id, DELETE /bookings/:id',
            packages: 'GET, GET /:id, POST, PUT /:id, DELETE /:id',
            health: 'GET /health',
            debug: 'GET /debug'
        }
    });
});

// Booking routes should come before /:id routes to avoid conflict
router.get('/bookings', async (req, res) => {
    try {
        // Use lean() to get plain objects instead of Mongoose documents
        const bookings = await PackageBooking.find().lean();
        res.status(200).json(bookings); // Fixed: Return bookings instead of savedBooking
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add POST route for bookings that was missing
router.post('/bookings', async (req, res) => {
    try {
        const newBooking = new PackageBooking(req.body);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/bookings/:id', async (req, res) => {
    try {
        const booking = await PackageBooking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Delete request received for booking:', id);

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid booking ID format'
            });
        }

        const booking = await PackageBooking.findById(id);
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found or may have been already deleted'
            });
        }

        await PackageBooking.findByIdAndDelete(id);
        
        console.log(`Successfully deleted booking with ID: ${id}`);
        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully',
            deletedId: id
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({
            message: 'Failed to delete booking',
            error: error.message
        });
    }
});

// Add public packages route with error handling
router.get('/public', async (req, res) => {
  try {
    console.log('Fetching public packages');
    const packages = await Package.find({ status: 'active' })
      .select('-__v')
      .sort('-createdAt')
      .lean();
    
    console.log(`Found ${packages.length} public packages`);
    res.json(packages);
  } catch (error) {
    console.error('Error fetching public packages:', error);
    res.status(500).json({ 
      message: 'Failed to fetch packages',
      error: error.message 
    });
  }
});

// Update main packages route with better error handling
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all packages');
    const packages = await Package.find()
      .select('-__v')
      .sort('-createdAt')
      .lean();
    
    console.log(`Found ${packages?.length || 0} packages`);
    
    if (!packages || packages.length === 0) {
      return res.json([]);
    }
    
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ 
      message: 'Internal server error while fetching packages',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get('/:id', getPackage);
router.post('/', upload.single('image'), createPackage);
router.put('/:id', upload.single('image'), updatePackage);
router.delete('/:id', deletePackage);

// Add a route to serve uploaded files
router.use('/uploads', express.static('uploads'));

module.exports = router;
