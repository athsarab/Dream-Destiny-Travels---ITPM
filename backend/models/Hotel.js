const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    availableRooms: {
        type: Number,
        required: [true, 'Number of available rooms is required'],
        min: [0, 'Available rooms cannot be negative']
    },
    pricePerNight: {
        type: Number,
        required: [true, 'Price per night is required'],
        min: [0, 'Price cannot be negative']
    },
    roomType: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['single', 'double', 'suite', 'deluxe']
    },
    facilities: {
        type: [{
            type: String,
            trim: true
        }],
        default: []
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }
}, {
    timestamps: true
});

// Add pre-save middleware to ensure facilities is an array
hotelSchema.pre('save', function(next) {
    if (!Array.isArray(this.facilities)) {
        this.facilities = [];
    }
    next();
});

module.exports = mongoose.model('Hotel', hotelSchema);
