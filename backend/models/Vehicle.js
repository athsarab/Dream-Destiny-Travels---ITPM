const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['car', 'van', 'bus']
    },
    capacity: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    plateNumber: {
        type: String,
        required: true,
        unique: true
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
