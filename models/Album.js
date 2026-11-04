const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cover_img: {
        type: String,
        required: true
    },
    release_date: {
        type: Date,
        required: true
    },
    genre: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
        required: true
    }],
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
    artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;