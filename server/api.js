/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");

// documentation here https://www.npmjs.com/package/spotify-web-api-node
const SpotifyWebApi = require("spotify-web-api-node");

// TODO: create an account at https://developer.spotify.com/dashboard/
// fill in your spotify developer information in .env
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URI,
});

router.get("/spotifyLogin", (req, res) => {
  auth.spotifyLogin(req, res, spotifyApi);
});

router.get("/callback", async (req, res) => {
  auth.callback(req, res, spotifyApi);
});

router.post("/logout", auth.logout);

router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// use client credentials flow
const generalSpotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Retrieve an access token.
const setNewToken = () => {
  generalSpotifyApi.clientCredentialsGrant().then(
    function (data) {
      console.log("The access token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      generalSpotifyApi.setAccessToken(data.body["access_token"]);
      // console.log(generalSpotifyApi);
    },
    function (err) {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );
};
setNewToken();
tokenRefreshInterval = setInterval(setNewToken, 1000 * 60 * 60);

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// not personalized calls (use general spotifyApi)

// Get Recommendations Based on Seeds
router.get("/getRecs", (req, res) => {
  console.log(generalSpotifyApi);
  generalSpotifyApi
    .getRecommendations(req.query)
    .then((data) => {
      // let recommendations = data.body;
      // console.log(recommendations);
      res.send(data.body);
    })
    .catch((err) => {
      console.log("Something went wrong!", err);
      res.status(400).send(err);
    });
});

// Get available genre seeds
router.get("/getGenreSeeds", (req, res) => {
  // console.log(generalSpotifyApi);
  generalSpotifyApi
    .getAvailableGenreSeeds()
    .then((data) => {
      res.send(data.body);
    })
    .catch((err) => {
      console.log("Something went wrong!", err);
      res.send(err);
    });
});

// Search tracks whose name, album or artist contains 'Love'
router.get("/searchTracks", (req, res) => {
  spotifyApi
    .searchTracks("Love")
    .then((data) => {
      console.log('Search by "Love"', data.body);
      res.send(data.body);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(err);
    });
});

// Search artists whose name contains 'Love'
router.get("/searchArtists", (req, res) => {
  spotifyApi.searchArtists("Love").then(
    function (data) {
      console.log('Search artists by "Love"', data.body);
      res.send(data.body);
    },
    function (err) {
      console.error(err);
      res.status(400).send(err);
    }
  );
});

// personalized calls (use loggedInSpotifyApi)
router.get("/getMe", (req, res) => {
  const loggedInSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URI,
  });
  loggedInSpotifyApi.setRefreshToken(req.user.refreshToken);
  loggedInSpotifyApi.refreshAccessToken().then((data) => {
    loggedInSpotifyApi.setAccessToken(data.body["access_token"]);
    loggedInSpotifyApi.getMe().then(
      function (data) {
        console.log("Some information about the authenticated user", data.body);
        res.send(data);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  });
});

router.get("/playlists", async (req, res) => {
  try {
    const loggedInSpotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_API_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.CALLBACK_URI,
    });
    loggedInSpotifyApi.setRefreshToken(req.user.refreshToken);
    loggedInSpotifyApi.refreshAccessToken().then(async (data) => {
      console.log("Access Token Refreshed!");
      loggedInSpotifyApi.setAccessToken(data.body["access_token"]);
      const result = await loggedInSpotifyApi.getUserPlaylists();
      res.status(200).send(result.body);
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
