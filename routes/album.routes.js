const router = require("express").Router()
const express = require("express");
const Album = require("../models/Album.js");
const Genre = require("../models/Genre.js");
const Artist = require("../models/Artist.js");


router.get('/',(req,res)=>{
    res.render('album/album.ejs')
})

router.get('/create',async(req,res)=>{

    let genres =  await Genre.find()
    let artists = await Artist.find()
    res.render('album/create.ejs',{genres, artists})

})

router.post('/create',async(req,res)=>{
    console.log(req.body)
})

module.exports = router;
