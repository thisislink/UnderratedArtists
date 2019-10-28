const express = require("express");
const router = require("./router")


//    https://api.spotify.com/v1/search?q=tag:hipster%20tag:new&year:2019&type=album&market=US&limit=50


const app = express();

// Get css styles
app.use(express.static('public'));

// Setup views engine
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use('/', router);

app.listen(1111);