require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);
// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:
app.get("/home", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  const { q } = req.query;
  spotifyApi
    .searchArtists(q)
    .then((data) => {
      //console.log("The items are --->>");
      //console.log(data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  console.log("got in to album");
  const { id } = req.params;
  spotifyApi
  .getArtistAlbums(id)
  .then(
    function (data) {
      console.log("This are the albums --->>>");
      console.log("Artist albums", data.body);
      res.render("albums", { albums: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
  .getAlbumTracks(id)
  .then(
    function (data) {
      console.log("this are the tracks -->>>");
      console.log(data.body);
      res.render("tracks", { tracks : data.body.items });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
// res.render("tracks")
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
