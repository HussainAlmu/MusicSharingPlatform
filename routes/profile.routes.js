const router = require("express").Router()
const User = require("../models/User.js");
const Album = require("../models/Album.js")
const Artist = require("../models/Artist.js");
const Review = require("../models/Review.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", async (req, res) => {
    const users = await User.find().populate("fav")
    const reviews = await Review.find()
    res.render('profile/profile.ejs',{users , reviews})
})

router.get("/:id", async (req, res) => {
    const profileUser = await User.findById(req.params.id).populate("fav")
    const artist = await Artist.find()
    const reviews = await Review.find({ user: req.params.id }).populate("album")
    const followers = await User.find({ following: req.params.id })
    const currentUser = req.session.theUser
        ? await User.findById(req.session.theUser._id).select("following")
        : null
    const isFollowing = currentUser?.following.some(id => id.equals(profileUser._id)) ?? false
    console.log(reviews)
    res.render('profile/profile-det.ejs',{ profileUser, artist, reviews, followers: followers.length, isFollowing })
})

router.get("/:id/reviews", async (req, res) => {
    const profileUser = await User.findById(req.params.id).populate("fav")
    const artist = await Artist.find()
    const reviews = await Review.find({ user: req.params.id }).populate("album")
    console.log(reviews)
    res.render('profile/profile-reviews.ejs',{ profileUser, artist, reviews })
})

router.get("/:id/fav", async (req, res) => {
    const profileUser = await User.findById(req.params.id).populate("fav")
    const artist = await Artist.find()
    const reviews = await Review.find({ user: req.params.id }).populate("album")
    console.log(reviews)
    res.render('profile/profile-fav.ejs',{ profileUser, artist, reviews })
})

router.post("/edit", isSignedIn, async (req, res) => {
    const userInDatabase = await User.findByIdAndUpdate(
        req.session.theUser._id,
        { $set: {
            username: req.body.username,
            pfp: req.body.pfp,
            bio: req.body.bio
        } },
        { new: true, runValidators: true }
    );

    if (!userInDatabase) return res.sendStatus(404);

    req.session.theUser = {
        _id: userInDatabase._id,
        username: userInDatabase.username,
        pfp: userInDatabase.pfp,
        bio: userInDatabase.bio
    };
    res.redirect("/profile/" + userInDatabase._id + "?updated=true");
})

router.post("/follow/:id", isSignedIn, async (req, res)=>{
    const currentUser = await User.findById(req.session.theUser._id).select("following")
    const isFollowing = currentUser.following.some(id => id.equals(req.params.id))
    await User.findByIdAndUpdate(req.session.theUser._id, isFollowing
        ? { $pull: { following: req.params.id } }
        : { $addToSet: { following: req.params.id } }
    )
    res.redirect(`/profile/${req.params.id}`);
})

module.exports = router;