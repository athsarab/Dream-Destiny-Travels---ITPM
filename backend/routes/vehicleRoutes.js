const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// Get all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort('-createdAt');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
});

// Add new vehicle
router.post('/', async (req, res) => {
    try {
        console.log('Received vehicle data:', req.body);

        // Create new vehicle with all fields
        const vehicle = new Vehicle({
            vehicleId: req.body.vehicleId,
            type: req.body.type,
            model: req.body.model, // Add model field
            seats: Number(req.body.seats),
            licenseInsuranceUpdated: new Date(req.body.licenseInsuranceUpdated),
            licenseInsuranceExpiry: new Date(req.body.licenseInsuranceExpiry),
            fuelType: req.body.fuelType,
            status: 'available'
        });

        // Basic validation
        const validationError = vehicle.validateSync();
        if (validationError) {
            return res.status(400).json({
                message: 'Please fill all required fields correctly',
                errors: validationError.errors
            });
        }

        const savedVehicle = await vehicle.save();
        res.status(201).json({
            success: true,
            message: 'Vehicle added successfully!',
            vehicle: savedVehicle
        });

    } catch (error) {
        console.error('Save error:', error);
        res.status(400).json({
            success: false,
            message: error.code === 11000 ? 'Vehicle ID already exists' : 'Failed to add vehicle. Please try again.'
        });
    }
});

// Get single vehicle
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update vehicle
router.put('/:id', async (req, res) => {
    try {
        const { vehicleId, type, model, seats, licenseInsuranceUpdated, licenseInsuranceExpiry, status, fuelType } = req.body;

        // Validate required fields
        if (!vehicleId || !type || !model || !seats) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        // Add fuel type validation
        if (!req.body.fuelType) {
            return res.status(400).json({ message: 'Please select a fuel type' });
        }

        const updateData = {
            vehicleId,
            type,
            model, // Add model field
            seats: Number(seats),
            licenseInsuranceUpdated: new Date(licenseInsuranceUpdated),
            licenseInsuranceExpiry: new Date(licenseInsuranceExpiry),
            fuelType,
            status: status || 'available'
        };

        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({ 
            message: error.code === 11000 ? 'Vehicle ID already exists' : error.message 
        });
    }
});

// Delete vehicle
router.delete('/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add route to manually check expiry
router.get('/check-expiry-notifications', async (req, res) => {
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringVehicles = await Vehicle.find({
            licenseInsuranceExpiry: {
                $gte: new Date(),
                $lte: thirtyDaysFromNow
            }
        });

        for (const vehicle of expiringVehicles) {
            const expiryDate = new Date(vehicle.licenseInsuranceExpiry).toLocaleDateString();
            const message = `🚨 VEHICLE LICENSE EXPIRY ALERT 🚨\n\n` +
                          `Vehicle Type: ${vehicle.type}\n` +
                          `Vehicle ID: ${vehicle.vehicleId}\n` +
                          `License & Insurance Expiry: ${expiryDate}\n\n` +
                          `Please renew before expiration.`;

            await sendWhatsAppNotification(process.env.ADMIN_PHONE_NUMBER, message);
        }

        res.json({ 
            success: true, 
            message: `Checked ${expiringVehicles.length} vehicles for expiring licenses` 
        });
    } catch (error) {
        console.error('Error checking expiry:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
