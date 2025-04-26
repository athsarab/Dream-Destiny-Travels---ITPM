const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: [true, 'Vehicle ID is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['car', 'van', 'jeep', 'tuk-tuks','motorcycle']
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'Must have at least 1 seat']
  },
  licenseInsuranceUpdated: {
    type: Date,
    required: [true, 'License update date is required']
  },
  licenseInsuranceExpiry: {
    type: Date,
    required: [true, 'License expiry date is required']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: {
      values: ['petrol', 'diesel', 'electric', 'hybrid'],
      message: 'Please select a valid fuel type'
    }
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'maintenance'],
    default: 'available'
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
