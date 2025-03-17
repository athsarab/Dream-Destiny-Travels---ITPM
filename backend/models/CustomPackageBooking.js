const mongoose = require('mongoose');

const customPackageBookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    travelDate: {
        type: Date,
        required: [true, 'Travel date is required']
    },
    additionalNotes: {
        type: String,
        trim: true,
        default: ''
    },
    selectedOptions: {
        type: Object,
        required: [true, 'Selected options are required']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CustomPackageBooking', customPackageBookingSchema);
