// Model for Albums
const mongoose = require("mongoose");

const Album = mongoose.model("Album", {
  title: String,
  tracks: Array,
  releaseDate: String,
  credits: Array,
  spotifyEmbed: String,
  links: {
    spotify: String,
    appleMusic: String,
    bandcamp: String,
  },
  cover: {
    front: String,
    back: String,
  },
  type: String,
});

module.exports = Album;
