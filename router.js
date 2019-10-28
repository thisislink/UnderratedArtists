const express = require("express");
const homeController = require("./controllers/homeController");
const artistsController = require("./controllers/artistsController");
const userController = require("./controllers/authorizeController");

const router = express.Router();

// Home Route
router.get('/', homeController.home);

// Authorize Route
router.get('/authorize', userController.authorize);

// Callback Route
router.get('/callback', userController.callback);

// Refresh Token
router.get('/refresh_token', userController.refresh_token);

// Artists Route
router.get('/artists', artistsController.artists);


module.exports = router;