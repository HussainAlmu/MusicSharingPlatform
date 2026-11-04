const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    song_name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    track_number: {
        type: Number,
        required: true
    },
    audio_url: {
        type: String,
        required: true
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    }
});

module.exports = mongoose.model('Song', songSchema);