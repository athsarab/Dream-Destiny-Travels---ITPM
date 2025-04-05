const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nic: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {  // Change position to role to match frontend
        type: String, 
        required: true,
        trim: true,
        enum: ['Travel Agent', 'Driver', 'Worker', 'Supplier']
    },
    phoneNumber: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: [0, 'Salary cannot be negative'],
        max: [2500, 'Salary cannot exceed $2,500'],
        validate: {
            validator: function(v) {
                return v <= 2500;
            },
            message: 'Maximum salary allowed is $2,500'
        }
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
