const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
    },
    review: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required: true
    },
}, { timestamps: true });

const review = mongoose.model("Review", reviewSchema);

module.exports = review;