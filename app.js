require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var callRouter = require('./routes/call'); // Import Twilio call route
var messageRouter = require('./routes/message');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Enable CORS for frontend communication

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/call', callRouter); // New route for Twilio call
app.use('/message', messageRouter);

module.exports = app;