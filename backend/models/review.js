const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    country:{
        type:String
    },
    comment:{
        type:String
    }
});

module.exports = Review = mongoose.model("reviews",ReviewSchema);