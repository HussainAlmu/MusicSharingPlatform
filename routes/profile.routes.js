const router = require("express").Router()
const User = require("../models/User.js");
const Album = require("../models/Album.js")
const Artist = require("../models/Artist.js");
const Review = require("../models/Review.js")

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id).populate("fav")
    const artist = await Artist.find()
    const reviews = await Review.find({ user: req.params.id })
    res.render('profile/profile-det.ejs',{ user, artist, reviews })
})

router.post("/edit", async (req, res) => {
    const userInDatabase = await User.findOneAndUpdate(
        { _id: req.session.user._id },
        {
            username: req.body.username,
            pfp: req.body.pfp,
            bio: req.body.bio
        },
        { new: true }
    );
    req.session.user = {
        username: req.body.username,
        pfp: req.body.pfp,
        bio: req.body.bio
    };
    console.log(req.body)
    res.redirect("/profile/" + req.session.user._id);
})

module.exports = router;