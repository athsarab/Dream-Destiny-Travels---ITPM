const express = require('express');
const router = express.Router();
const Package = require('../models/Package'); // Add this line
const PackageBooking = require('../models/PackageBooking');
const upload = require('../middleware/upload');
const {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage
} = require('../controllers/packageController');

// Add health check endpoint at the top of the file
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

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
