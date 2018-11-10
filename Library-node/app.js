var express = require('express');
var app = express();
var db = require('./db');
var cors = require('cors');
var LibraryController = require('./controllers/LibraryController');

//CORS Access lift (we eventually want to add security using JWT and whitelist our platforms)
app.use(cors());

//Include Controller Routes
app.use('/library', LibraryController);

module.exports = app;
