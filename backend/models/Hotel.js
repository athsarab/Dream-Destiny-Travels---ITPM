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
        min: [0, 'Price cannot be negative'],
        max: [2500, 'Price cannot exceed $2,500'],
        validate: {
            validator: function(v) {
                return v >= 0 && v <= 2500;
            },
            message: props => `${props.value} is not a valid price! Price must be between $0 and $2,500`
        }
    },
    roomType: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['single', 'double', 'suite', 'deluxe']
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
