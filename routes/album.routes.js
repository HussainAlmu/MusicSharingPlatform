const router = require("express").Router()
const express = require("express");
const Album = require("../models/Album.js");
const Genre = require("../models/Genre.js");
const Artist = require("../models/Artist.js");
const Song = require("../models/Song.js");
const User = require("../models/User.js");
const { render } = require("ejs");
const Review = require("../models/Review.js");


router.get('/', async (req, res) => {
    console.log(req.query)
    const filter = {}
    const requestedPage = Number.parseInt(req.query.page, 10);
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const skipValue = (page - 1) * 20
    if (req.query.s) {
        const search = { $regex: req.query.s, $options: 'i' };
        const matchingArtists = await Artist.find({ name: search }).select('_id');
        filter.$or = [
            { name: search },
            { artist_id: { $in: matchingArtists.map(artist => artist._id) } }
        ];
    }
    const matchingAlbums = await Album.find(filter);
    const reviewCounts = await Review.aggregate([
        { $match: { album: { $in: matchingAlbums.map(album => album._id) } } },
        { $group: { _id: '$album', count: { $sum: 1 } } }
    ]);
    const reviewCountByAlbum = new Map(
        reviewCounts.map(({ _id, count }) => [_id.toString(), count])
    );
    const allAlbums = matchingAlbums
        .sort((a, b) =>
            (reviewCountByAlbum.get(b._id.toString()) || 0) -
            (reviewCountByAlbum.get(a._id.toString()) || 0)
        )
        .slice(skipValue, skipValue + 20);
    await Album.populate(allAlbums, { path: 'artist_id' });
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

    if (req.body.track_no.length >= 2) {
        for (let index = 0; index < req.body.track_no.length; index++) {
            const newSong = await Song.create({
                song_name: req.body.track_name[index],
                track_number: req.body.track_no[index],
                audio_url: req.body.audio_url[index],
                duration: req.body.track_duration[index],
            })
            newAlbum.songs.push(newSong._id);
        }
    } else {
        const newSong = await Song.create({
            song_name: req.body.track_name,
            track_number: req.body.track_no,
            audio_url: req.body.audio_url,
            duration: req.body.track_duration,
        });
        newAlbum.songs.push(newSong._id);
    }
    await newAlbum.save();
    res.redirect('/album');

});

router.get("/:id", async (req, res) => {
    console.log(req.params.id);
    const album = await Album.findById(req.params.id).populate('songs').populate("artist_id");
    const albumByArtist = await Album.find({ artist_id: album.artist_id._id });
    const review = req.session.theUser ? await Review.findOne({ album: album._id, user: req.session.theUser._id }).populate('user') : null;
    const allReviews = await Review.find({ album: album._id }).populate('user');
    const user = await User.findById(req.session.theUser._id)
    let isFav = false;
    for (let oneFav of user.fav) {
        if (oneFav.toString() === req.params.id) isFav = true;
    }
    console.log(user)
    let songs = album.songs
    res.render('album/album-det.ejs', { album, songs, albumByArtist, review, allReviews, isFav })
})

router.post("/rate", async (req, res) => {
    const review = await Review.create({
        rating: req.body.rating,
        title: req.body.title,
        review: req.body.review_text,
        user: req.session.theUser._id,
        album: req.body.page_id,
    })
    res.redirect('/album');
})

router.post("/rate/edit", async (req, res) => {
    await Review.findOneAndUpdate({
        user: req.session.theUser._id,
        album: req.body.page_id,
    },
        {
            rating: req.body.rating,
            title: req.body.title,
            review: req.body.review_text,
        }, { new: true });
    res.redirect('/album');
})

router.post("/fav/:id", async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.session.theUser._id }, {
        $addToSet: { fav: req.params.id }
    });
    res.redirect(`/album/${req.params.id}`);
})

router.post("/removeFav/:id", async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.session.theUser._id }, {
        $pull: { fav: req.params.id }
    });
    res.redirect(`/album/${req.params.id}`);
})

router.get("/delete/:id", async (req,res) => {
    await Album.findByIdAndDelete(req.params.id);
    res.redirect('/album');
})

module.exports = router;
