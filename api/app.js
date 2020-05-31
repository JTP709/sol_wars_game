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
// app.set('react-app-dir', path.join(__dirname, '/../client/build'))
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/../client/build')));

// app.use('*', indexRouter);
app.use('/testAPI', testAPIRouter);

// auth validation
app.get('/auth', verifyAuthHttpWrapper((_,response) => response.sendStatus(200)));

// db stuff
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', verifyAuthHttpWrapper(db.createUser));
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

// react app
app.get('*', function(req, res) {
  // res.render('index', { title: 'Express' });
  res.sendfile(path.join(__dirname, '/../client/build/index.html'));
});

// socket.io events

var io = socket_io();
app.io = io;

io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
    socket.to(socket.room).emit('playerDisconnected');
    socket.leave(socket.room);
  });

  socket.on('leaveGame', function() {
    socket.to(socket.room).emit('playerLeft');
    socket.leave(socket.room);
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
      .then(() => {
        socket.userId = data.playerId;
        return db.createNewGame(data.playerId, data.playerUserName);
      })
      .then(response => {
        socket.room = response.gameId;
        socket.join(response.gameId);
        socket.emit('gameStartSuccess', response);
      })
      .catch(error => {
        console.error('socket_startGame_error: ', error);
        socket.emit('gameStartError', data.playerId);
      });
  });

  socket.on('joinGameRequest', function(data){
    const { token, playerId, gameId, playerUserName } = data;
    googleVerify(token)
      .then(() => {
        socket.userId = data.playerId;
        return db.joinGame(playerId, playerUserName, gameId);
      })
      .then(response => {
        const { action } = response;
        if (action === 'gameDoesNotExist') {
          socket.emit('gameDoesNotExist');
        }
        if (action === 'joinedGameInProgress') {
          socket.room = gameId;
          socket.join(gameId);
          socket.emit('joinedGameInProgressSuccess', response);
          socket.to(gameId).emit('playerHasRejoined', response);
        }
        if (action ==='joinedNewGame') {
          socket.room = gameId;
          socket.join(gameId);
          socket.emit('joinGameSuccess', response);
          socket.to(gameId).emit('playerHasJoined', response);
        }
      })
      .catch(error => {
        console.error('socket_joinGame_error', error);
        socket.emit('joinGameError', gameId);
      });
  });

  socket.on('nextTurnRequest', function(data){
    const { token, playerId, gameId } = data;
    googleVerify(token)
      .then(() => {
        return db.validateNextTurn(playerId, gameId);
      })
      .then(response => {
        if (response.message === 'PLAYER_NOT_IN_GAME') {
          socket.in(gameId).emit('playerNotInGame');
          socket.emit('playerNotInGame');
        } else if (response.message === 'VALID_TURN_SUBMISSION') {
          socket.in(gameId).emit('validTurnSubmission', { currentPlayer: response.currentPlayer, turn: response.turn })
          socket.emit('validTurnSubmission', { currentPlayer: response.currentPlayer, turn: response.turn })
        } else if (response.message === 'INVALID_TURN_SUBMISSION') {
          socket.in(gameId).emit('invalidTurnSubmission')
          socket.emit('invalidTurnSubmission')
        } else {
          socket.in(gameId).emit('SERVER_ERROR')
          socket.emit('SERVER_ERROR')
        }
      })
  });
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
