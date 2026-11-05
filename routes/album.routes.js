const router = require("express").Router()
const express = require("express");
const Album = require("../models/Album.js");
const Genre = require("../models/Genre.js");
const Artist = require("../models/Artist.js");
const Song = require("../models/Song.js");
const { render } = require("ejs");


router.get('/', async (req, res) => {
    const allAlbums = await Album.find().populate('artist_id');
    res.render('album/album.ejs', { album: allAlbums });
});

router.get('/create', async (req, res) => {
    let genres = await Genre.find();
    let artists = await Artist.find();
    res.render('album/create.ejs', { genres, artists });
});

router.post('/create', async (req, res) => {
    const newAlbum = await Album.create({
        name: req.body.name,
        cover_img: req.body.cover_img,
        release_date: req.body.release_date,
        genre: req.body.genre,
        artist_id: req.body.artist_id,
        description: req.body.description
    })

    for (let index = 0; index < req.body.track_no.length; index++) {
        const newSong = await Song.create({
            song_name: req.body.track_name[index],
            track_number: req.body.track_no[index],
            audio_url: req.body.audio_url[index],
            duration: req.body.track_duration[index],
        })
        newAlbum.songs.push(newSong._id);

    }
    await newAlbum.save();
    res.redirect('/album');

});

router.get("/:id",async (req, res) => {
    const album = await Album.findById(req.params.id).populate('songs').populate("artist_id");
    const albumByArtist = await Album.find({ artist_id: album.artist_id._id });
    let songs = album.songs
    res.render('album/album-det.ejs', {album,songs,albumByArtist})
})

router.post("/rate",  async (req, res) => {
    console.log(req.body)
})

module.exports = router;
