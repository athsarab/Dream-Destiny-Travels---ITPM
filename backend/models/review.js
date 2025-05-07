const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: String
    },
    comment: {
        type: String
    },
    type: {
        type: String,
        enum: ['hotel', 'guide', 'vehicle'],
        required: true,
        default: 'hotel'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

module.exports = Review = mongoose.model("reviews", ReviewSchema);