const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

// Get all hotels
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find().sort('-createdAt');
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hotels', error: error.message });
    }
});

// Get single hotel
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid hotel ID format' });
        }

        const hotel = await Hotel.findById(id).exec();
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.json(hotel);
    } catch (error) {
        console.error('Error fetching hotel:', error);
        res.status(500).json({ 
            message: 'Error fetching hotel',
            error: error.message 
        });
    }
});

// Add new hotel
router.post('/', async (req, res) => {
    try {
        console.log('Received hotel data:', req.body);

        // 1. Validate required fields
        const requiredFields = ['name', 'location', 'contactNumber', 'roomTypes', 'roomPrices', 'roomQuantities'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // 2. Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(req.body.contactNumber)) {
            return res.status(400).json({
                message: 'Contact number must be exactly 10 digits'
            });
        }

        // 3. Room types validation
        if (!Array.isArray(req.body.roomTypes) || req.body.roomTypes.length === 0) {
            return res.status(400).json({
                message: 'At least one room type must be selected'
            });
        }

        // 4. Room prices validation - ensure every room type has a price
        const roomPrices = req.body.roomPrices;
        const missingPrices = req.body.roomTypes.filter(type => 
            !roomPrices[type] || parseFloat(roomPrices[type]) <= 0
        );
        
        if (missingPrices.length > 0) {
            return res.status(400).json({
                message: `Missing or invalid prices for room types: ${missingPrices.join(', ')}`
            });
        }

        // 5. Room quantities validation - ensure every room type has a quantity
        const roomQuantities = req.body.roomQuantities;
        const missingQuantities = req.body.roomTypes.filter(type => 
            !roomQuantities[type] || parseInt(roomQuantities[type]) < 0
        );
        
        if (missingQuantities.length > 0) {
            return res.status(400).json({
                message: `Missing or invalid quantities for room types: ${missingQuantities.join(', ')}`
            });
        }

        // Calculate total available rooms
        const totalRooms = Object.values(roomQuantities).reduce(
            (sum, quantity) => sum + parseInt(quantity), 0
        );

        // 6. Data type validation and conversion
        const hotelData = {
            name: req.body.name.trim(),
            location: req.body.location.trim(),
            availableRooms: totalRooms,
            roomTypes: req.body.roomTypes,
            roomPrices: req.body.roomPrices, // Store as Map in MongoDB
            roomQuantities: req.body.roomQuantities,
            contactNumber: req.body.contactNumber.trim(),
            status: 'available'
        };

        // 7. Create and save hotel
        const hotel = new Hotel(hotelData);
        const savedHotel = await hotel.save();
        console.log('Hotel saved successfully:', savedHotel);
        res.status(201).json(savedHotel);
    } catch (error) {
        console.error('Error creating hotel:', error);
        res.status(400).json({
            message: 'Failed to create hotel',
            error: error.message
        });
    }
});

// Update hotel
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid hotel ID format' });
        }

        // Phone validation
        const { contactNumber } = req.body;
        const phoneRegex = /^\d{10}$/;
        if (!contactNumber || !phoneRegex.test(contactNumber)) {
            return res.status(400).json({ message: 'Contact number must be exactly 10 digits' });
        }

        // Room types validation
        if (!req.body.roomTypes || !Array.isArray(req.body.roomTypes) || req.body.roomTypes.length === 0) {
            return res.status(400).json({ message: 'At least one room type must be selected' });
        }

        // Room prices validation - ensure every room type has a price
        const roomPrices = req.body.roomPrices || {};
        const missingPrices = req.body.roomTypes.filter(type => 
            !roomPrices[type] || parseFloat(roomPrices[type]) <= 0
        );
        
        if (missingPrices.length > 0) {
            return res.status(400).json({
                message: `Missing or invalid prices for room types: ${missingPrices.join(', ')}`
            });
        }

        // Room quantities validation
        const roomQuantities = req.body.roomQuantities || {};
        const missingQuantities = req.body.roomTypes.filter(type => 
            roomQuantities[type] === undefined || parseInt(roomQuantities[type]) < 0
        );
        
        if (missingQuantities.length > 0) {
            return res.status(400).json({
                message: `Missing or invalid quantities for room types: ${missingQuantities.join(', ')}`
            });
        }

        // Calculate total available rooms
        const totalRooms = Object.values(roomQuantities).reduce(
            (sum, quantity) => sum + parseInt(quantity), 0
        );

        // Find the hotel first to apply an update that will pass validation
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // First update the roomTypes which will be referenced by the validation
        hotel.roomTypes = req.body.roomTypes;
        
        // Create objects for prices and quantities
        const pricesObject = {};
        const quantitiesObject = {};
        
        req.body.roomTypes.forEach(type => {
            if (roomPrices[type]) {
                pricesObject[type] = parseFloat(roomPrices[type]);
            }
            if (roomQuantities[type] !== undefined) {
                quantitiesObject[type] = parseInt(roomQuantities[type]);
            }
        });
        
        // Update hotel fields
        hotel.roomPrices = pricesObject;
        hotel.roomQuantities = quantitiesObject;
        hotel.name = req.body.name;
        hotel.location = req.body.location;
        hotel.availableRooms = totalRooms;
        hotel.contactNumber = req.body.contactNumber;
        hotel.status = req.body.status || 'available';
        
        // Save the updated hotel
        const updatedHotel = await hotel.save();

        res.json(updatedHotel);
    } catch (error) {
        console.error('Error updating hotel:', error);
        res.status(400).json({
            message: 'Failed to update hotel',
            error: error.message
        });
    }
});

// Delete hotel
router.delete('/:id', async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hotel deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
