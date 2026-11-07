const router = require("express").Router()
const User = require("../models/User.js");
const Album = require("../models/Album.js")
const Artist = require("../models/Artist.js");
const Review = require("../models/Review.js")

router.get("/", async (req, res) => {
    const users = await User.find().populate("fav")
    const reviews = await Review.find()
    res.render('profile/profile.ejs',{users , reviews})
})

router.get("/:id", async (req, res) => {
    const profileUser = await User.findById(req.params.id).populate("fav")
    const artist = await Artist.find()
    const reviews = await Review.find({ user: req.params.id }).populate("album")
    console.log(reviews)
    res.render('profile/profile-det.ejs',{ profileUser, artist, reviews })
})

router.post("/edit", async (req, res) => {
    const userInDatabase = await User.findOneAndUpdate(
        { _id: req.session.theUser._id },
        {
            username: req.body.username,
            pfp: req.body.pfp,
            bio: req.body.bio
        },
        { new: true }
    );
    req.session.theUser = {
        username: req.body.username,
        pfp: req.body.pfp,
        bio: req.body.bio
    };
    console.log(req.body)
    res.redirect("/profile/" + req.session.theUser._id);
})

module.exports = router;