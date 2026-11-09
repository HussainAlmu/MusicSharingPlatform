const router = require("express").Router();
const Album = require("../models/Album.js");
const Artist = require("../models/Artist.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
const isAdmin = require("../middleware/is-admin.js");

router.get("/", async (req, res) => {
  const [userCount, albumCount, artistCount, reviewCount, recentUsers] = await Promise.all([
    User.countDocuments(),
    Album.countDocuments(),
    Artist.countDocuments(),
    Review.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5).select("username email role createdAt")
  ]);

  res.render("admin/dashboard.ejs", {
    stats: [
      { label: "Users", value: userCount },
      { label: "Albums", value: albumCount },
      { label: "Artists", value: artistCount },
      { label: "Reviews", value: reviewCount }
    ],
    recentUsers
  });
});

module.exports = router;
