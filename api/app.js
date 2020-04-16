var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var db = require('./store/db');
var socket_io = require('socket.io')

var { verifyAuthHttpWrapper, googleVerify } = require('./auth/googleVerify');
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

// app.use('*', indexRouter);
app.use('/testAPI', testAPIRouter);

// auth validation
app.get('/api/auth', verifyAuthHttpWrapper((_,response) => response.sendStatus(200)));

// db stuff
app.get('/api/users', db.getUsers);
app.get('/api/users/:id', db.getUserById);
app.post('/api/users', verifyAuthHttpWrapper(db.createUser));
app.put('/api/users/:id', db.updateUser);
app.delete('/api/users/:id', db.deleteUser);

// react app
app.get('*', function(req, res) {
  // res.render('index', { title: 'Express' });
  res.sendfile('../client/build/index.html');
});

// socket.io events

var io = socket_io();
app.io = io;

io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  // socket.on('emit data!', function(data) {
  //   console.log('received data: ', data)
  // });

  // socket.on('user', function(data) {
  //   console.log('user: ', data.user);
  //   io.emit('greeting message', `hello, ${data.user}`)
  // });

  socket.on('startGameRequest', function(data){
    // console.log('data received: ', 'start game', data.token, data.playerId);
    googleVerify(data.token)
      .then(() => db.createNewGame(data.playerId))
      .then(response => {
        socket.join(response.gameId);
        socket.emit('gameStartSuccess', { gameId: response.gameId});
      })
      .catch(error => {
        console.error('socket_startGame_error: ', error);
        socket.emit('gameStartError', data.playerId);
      });
  });

  socket.on('joinGameRequest', function(data){
    const { token, playerId, gameId } = data;
    googleVerify(token)
      .then(() => db.joinGame(playerId, gameId))
      .then(response => {
        switch(response) {
          case 'gameDoesNotExist':
            socket.emit('gameDoesNotExist');
          case 'joinedGameInProgress':
            socket.join(gameId);
            socket.emit('joinedGameInProgressSuccess', { gameId});
            socket.to(gameId).emit('playerHasRejoined');
          case'joinedNewGame':
          default:
            socket.join(gameId);
            socket.emit('joinGameSuccess', { gameId});
            socket.to(gameId).emit('playerTwoHasJoined');
        }
      })
      .catch(error => {
        console.error('socket_joinGame_error', error);
        socket.emit('joinGameError', gameId);
      })
  })
});


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
