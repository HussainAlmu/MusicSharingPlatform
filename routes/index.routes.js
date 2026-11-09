const router = require("express").Router()
const Album = require("../models/Album.js");
const Genre = require("../models/Genre.js");
const Artist = require("../models/Artist.js");
const Song = require("../models/Song.js");
const User = require("../models/User.js");
const { render } = require("ejs");
const Review = require("../models/Review.js");
const isSignedIn = require("../middleware/is-signed-in.js");


router.get('/', async (req, res) => {
    const matchingAlbums = await Album.find();
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


 let friendReviews = []
    if (req.session.theUser) {
        const currentUser = await User.findById(req.session.theUser._id).select("following")
        const followingIds = currentUser?.following ?? []
        if (followingIds.length > 0) {
            friendReviews = (await Review.find({ user: { $in: followingIds } })
                .populate("user")
                .populate("album")
                .sort({ createdAt: -1 }))
                .filter(review => review.album)
        }
    }
    
    const artist = await Artist.find()

        const users = await User.find().populate("fav")
        const reviews = await Review.find()
    res.render('homepage.ejs',{allAlbums , friendReviews , artist, users, reviews})
})
module.exports = router;
