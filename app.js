//IMPORTS
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var indexRouter = require('./routes/index');
var teacherRouter = require('./routes/teacher');
var studentRouter = require('./routes/student');
var courseRouter = require('./routes/course');

//DATABASE CONNECTION START
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/thementor';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected Correctly to Server");
})
.catch((err) => {
  console.log(err);
});
//DATABASE CONNECTION END

//SERVER SETUP START
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

//ROUTING START
app.use('/', indexRouter);
app.use('/teachers',  teacherRouter);
app.use('/students',  studentRouter);
app.use('/courses',  courseRouter);
//ROUTING END

//SERVER SETUP END


//ERROR HANDLING START
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
// ERROR HANDLING END


module.exports = app;