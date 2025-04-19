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
    roomTypes: {
        type: [String],
        required: [true, 'Room types are required'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'At least one room type must be selected'
        }
    },
    roomQuantities: {
        type: Map,
        of: Number,
        default: {},
        validate: {
            validator: function(v) {
                // Ensure each room type has a quantity
                if (!this.roomTypes) return false;
                return this.roomTypes.every(type => v.get(type) >= 0);
            },
            message: 'Each room type must have a quantity specified'
        }
    },
    roomPrices: {
        type: Map,
        of: Number,
        required: [true, 'Room prices are required'],
        validate: {
            validator: function(v) {
                // At least one price for each room type
                if (!this.roomTypes) return false;
                return this.roomTypes.every(type => v.get(type) > 0);
            },
            message: 'A price must be set for each room type'
        }
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

module.exports = mongoose.model('Hotel', hotelSchema);
