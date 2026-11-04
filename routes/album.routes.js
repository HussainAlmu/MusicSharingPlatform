const router = require("express").Router()
const express = require("express");
const Album = require("../models/Album.js");
const Genre = require("../models/Genre.js");
const Artist = require("../models/Artist.js");
const Song = require("../models/Song.js")


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

    for (let index = 0; index <  req.body.track_no.length; index++) {
        const newSong = await Song.create({
            
        })
        
    }

    res.redirect('/album');

});

module.exports = router;
