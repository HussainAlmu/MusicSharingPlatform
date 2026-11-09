// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const {MongoStore} = require("connect-mongo");
const connectToDB = require('./db.js')

const Genre = require("./models/Genre.js");
const Artist = require("./models/Artist.js");
const Review = require("./models/Review.js")

// middleware imports
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// routes Imports
const authController = require("./routes/auth.routes.js");
const indexController = require("./routes/index.routes.js");
const albumController = require("./routes/album.routes.js");
const profileController = require("./routes/profile.routes.js");
const adminController = require("./routes/admin.routes.js");
const Album = require("./models/Album.js");
const Song = require("./models/Song.js");

// Middleware
app.use(express.static('public')) // my app will serve all static files from public folder
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);
app.use(passUserToView)




async function makeArtist() {
  await Artist.create({
    name: "Radiohead"
  });
}

async function makeAlbum() {
  let artist = await Artist.findOne({ name: "The Strokes" });
  if (!artist) {
    artist = await Artist.create({ name: "The Strokes" });
  }

  let genre = await Genre.findOne({ name: "rock" });
  if (!genre) {
    genre = await Genre.create({ name: "rock" });
  }

  const newAlbum = await Album.create({
    name: "The New Abnormal",
    cover_img: "https://upload.wikimedia.org/wikipedia/en/f/f8/The_Strokes_-_The_New_Abnormal.png",
    release_date: new Date("2020-04-10"),
    genre: [genre._id],
    artist_id: artist._id,
    description: "The New Abnormal is the sixth studio album by The Strokes, released in 2020. The album explores themes of uncertainty, relationships, nostalgia, and modern life. It combines indie rock, alternative rock, and new wave influences, featuring atmospheric production and catchy melodies. Standout tracks include The Adults Are Talking, Selfless, Brooklyn Bridge to Chorus, Bad Decisions, and Ode to the Mets.",
    songs: []
  });

  const tracks = [
    { song_name: "The Adults Are Talking", track_number: 1, duration: "5:09" },
    { song_name: "Selfless", track_number: 2, duration: "3:42" },
    { song_name: "Brooklyn Bridge to Chorus", track_number: 3, duration: "3:55" },
    { song_name: "Bad Decisions", track_number: 4, duration: "4:53" },
    { song_name: "Eternal Summer", track_number: 5, duration: "6:15" },
    { song_name: "At the Door", track_number: 6, duration: "5:10" },
    { song_name: "Why Are Sundays So Depressing", track_number: 7, duration: "4:35" },
    { song_name: "Not the Same Anymore", track_number: 8, duration: "5:37" },
    { song_name: "Ode to the Mets", track_number: 9, duration: "5:51" }
  ];

  for (const track of tracks) {
    const song = await Song.create({
      ...track,
      audio_url: ""
    });

    newAlbum.songs.push(song._id);
  }

  await newAlbum.save();
  return newAlbum;
}





// Routes go here
app.use('/auth',authController)
app.use('/',indexController)
app.use('/album',albumController)
app.use("/profile",profileController)
app.use("/admin", adminController)


// connect to database and listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();