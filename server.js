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
await Review.insertMany([
    {
        rating: 5,
        title: "One of Tyler's best albums",
        review: "IGOR is an incredible album. The production is amazing and every song contributes to the overall story.",
        user: "6aeda1c9c9702203b37e2881",
        album: "6aeb819701da59a31845952e"
    },
    {
        rating: 4,
        title: "Amazing production",
        review: "Tyler experiments with different sounds and creates a unique atmosphere. Some songs took a while to grow on me.",
        user: "6aeda1d6c9702203b37e2882",
        album: "6aeb819701da59a31845952e"
    },
    {
        rating: 5,
        title: "A masterpiece",
        review: "IGOR is a masterpiece from beginning to end. The storytelling and transitions make the album feel complete.",
        user: "6aeda1e1c9702203b37e2883",
        album: "6aeb819701da59a31845952e"
    },
    {
        rating: 3,
        title: "Good but not for everyone",
        review: "The production is creative, but the heavy vocal effects are not always my thing. Still a good album.",
        user: "6aeda1ebc9702203b37e2884",
        album: "6aeb819701da59a31845952e"
    },
    {
        rating: 4,
        title: "Unique listening experience",
        review: "I love the combination of funk, soul and alternative hip-hop. A very creative project.",
        user: "6aeda1f6c9702203b37e2885",
        album: "6aeb819701da59a31845952e"
    }
]);
}






// Routes go here
app.use('/auth',authController)
app.use('/',indexController)
app.use('/album',albumController)


// connect to database and listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();