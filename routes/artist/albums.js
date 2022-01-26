const express = require("express");
const router = express.Router();
const Album = require("../../models/artist/Album");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch all albums
router.get(`/albums`, async (req, res) => {
  console.log("Using Route : /albums");
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch a specific album
router.get(`/album/:id`, async (req, res) => {
  console.log("Using Route : /album/:id");
  try {
    const album = await Album.findById(req.params.id);
    res.status(200).json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new album
router.post(`/album/create`, async (req, res) => {
  console.log("Using Route : /album/create");
  const urlCheck = /^((http|https|ftp):\/\/)/;
  const {
    title,
    tracks,
    releaseDate,
    credits,
    spotifyEmbed,
    spotify,
    appleMusic,
    bandcamp,
    type,
  } = req.fields;
  const front = req.files.front ? req.files.front.path : req.fields.front;
  const back = req.files.back ? req.files.back.path : req.fields.back;
  let frontCover = "";
  let backCover = "";
  try {
    //   Checking if front and back covers are filess or cloudinary URLs
    if (!urlCheck.test(front)) {
      const result = await cloudinary.uploader.upload(front, {
        folder: "/articles",
      });
      frontCover = result.url;
    } else {
      frontCover = front;
    }
    if (!urlCheck.test(back)) {
      const result = await cloudinary.uploader.upload(back, {
        folder: "/artist/albums",
      });
      backCover = result.url;
    } else {
      backCover = back;
    }
    // Creating new album
    const newAlbum = await new Album({
      title,
      tracks,
      releaseDate,
      credits,
      spotifyEmbed,
      links: {
        spotify,
        appleMusic,
        bandcamp,
      },
      cover: {
        front: frontCover,
        back: backCover,
      },
      type,
    });
    newAlbum.save();
    res.status(200).json({
      _id: newAlbum._id,
    });
    console.log("New album created!");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
