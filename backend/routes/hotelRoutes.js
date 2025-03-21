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

        // Data validation
        const hotel = new Hotel(req.body);
        const validationError = hotel.validateSync();
        
        if (validationError) {
            console.log('Validation errors:', validationError.errors);
            return res.status(400).json({
                message: 'Validation failed',
                errors: Object.values(validationError.errors).map(err => err.message)
            });
        }

        const savedHotel = await hotel.save();
        console.log('Hotel saved:', savedHotel);
        res.status(201).json(savedHotel);
    } catch (error) {
        console.error('Error creating hotel:', error);
        res.status(400).json({
            message: 'Failed to create hotel',
            error: error.message,
            details: error.errors || error
        });
    }
});

// Update hotel
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Update request for hotel ID:', id);
        console.log('Update data received:', req.body);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid hotel ID format' });
        }

        // Validate required fields
        const requiredFields = ['name', 'location', 'roomType', 'contactNumber'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Prepare update data with proper type conversion
        const updateData = {
            name: req.body.name,
            location: req.body.location,
            availableRooms: Math.max(0, parseInt(req.body.availableRooms) || 0),
            pricePerNight: Math.max(0, parseFloat(req.body.pricePerNight) || 0),
            roomType: req.body.roomType,
            contactNumber: req.body.contactNumber,
            facilities: Array.isArray(req.body.facilities) ? req.body.facilities : [],
            status: req.body.status || 'available'
        };

        const updatedHotel = await Hotel.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, 
                runValidators: true,
                context: 'query' 
            }
        );

        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        console.log('Hotel updated successfully:', updatedHotel);
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
