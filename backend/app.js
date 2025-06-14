require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coursesRouter = require('./routes/courses');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static course files if they exist in the courses folder
app.get('/page', async (req, res, next) => {
  try {
    const courseFile = path.join(__dirname, 'course', req.query.coursePage + '.html');
    await fs.promises.access(courseFile, fs.constants.F_OK);
    res.sendFile(courseFile);
  } catch (err) {
    next(); // File does not exist, continue to next middleware
  }
});
app.get('/audio', async (req, res, next) => {
  try {
    const courseFile = path.join(__dirname, 'course', req.query.courseAudio + '.wav');
    await fs.promises.access(courseFile, fs.constants.F_OK);
    res.sendFile(courseFile);
  } catch (err) {
    next(); // File does not exist, continue to next middleware
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
