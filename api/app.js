var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var db = require('./store/db');

var { verifyAuth } = require('./auth/googleVerify')
var indexRouter = require('./routes/index');
var testAPIRouter = require('./routes/testAPI');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('../client/build'));

app.use('/', indexRouter);
app.use('/testAPI', testAPIRouter);

// auth validation
app.get('/auth', verifyAuth((_,response) => response.sendStatus(200)));

// db stuff
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', verifyAuth(db.createUser));
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

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
  console.error(err)
  // res.render('error');
});

module.exports = app;
