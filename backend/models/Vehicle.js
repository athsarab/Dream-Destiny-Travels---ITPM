const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['car', 'van', 'jeep', 'tuk-tuk', 'motorcycle'],
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    trim: true
  },
  licenseInsuranceUpdated: {
    type: Date,
    required: true
  },
  licenseInsuranceExpiry: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'booked', 'maintenance'],
    trim: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Assuming your employees are stored in an Employee collection
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
