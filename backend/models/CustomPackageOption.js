const mongoose = require('mongoose');

const customPackageOptionSchema = new mongoose.Schema({
    name: {  // Changed from 'category' to 'name' for consistency
        type: String,
        required: true,
        trim: true,
        unique: true  // Ensure unique category names
    },
    options: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('CustomPackageOption', customPackageOptionSchema);