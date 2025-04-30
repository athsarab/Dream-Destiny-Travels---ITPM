const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Employee = require('../models/Employee'); // Assuming this model exists

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedDriver');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedDriver');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new vehicle
router.post('/', async (req, res) => {
  try {
    // Check if the vehicle ID already exists
    const existingVehicle = await Vehicle.findOne({ vehicleId: req.body.vehicleId });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle ID already exists' });
    }

    // Process driver assignment if provided
    if (req.body.assignedDriver && req.body.assignedDriver !== 'none') {
      // Verify the driver exists
      const driver = await Employee.findById(req.body.assignedDriver);
      if (!driver) {
        return res.status(400).json({ message: 'Selected driver not found' });
      }
    }

    const vehicle = new Vehicle({
      vehicleId: req.body.vehicleId,
      type: req.body.type,
      model: req.body.model,
      seats: req.body.seats,
      fuelType: req.body.fuelType,
      licenseInsuranceUpdated: req.body.licenseInsuranceUpdated,
      licenseInsuranceExpiry: req.body.licenseInsuranceExpiry,
      status: req.body.status || 'available',
      assignedDriver: req.body.assignedDriver === 'none' ? null : req.body.assignedDriver
    });

    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a vehicle
router.put('/:id', async (req, res) => {
  try {
    // Check if updating vehicle ID and if it already exists
    if (req.body.vehicleId) {
      const existingVehicle = await Vehicle.findOne({ 
        vehicleId: req.body.vehicleId,
        _id: { $ne: req.params.id }
      });
      
      if (existingVehicle) {
        return res.status(400).json({ message: 'Vehicle ID already exists' });
      }
    }

    // Process driver assignment if provided
    if (req.body.assignedDriver && req.body.assignedDriver !== 'none') {
      // Verify the driver exists
      const driver = await Employee.findById(req.body.assignedDriver);
      if (!driver) {
        return res.status(400).json({ message: 'Selected driver not found' });
      }
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        assignedDriver: req.body.assignedDriver === 'none' ? null : req.body.assignedDriver
      },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
