import React from 'react';

import socket from './socket/socket';
import AppRouter from './components/AppRouter';

import './App.css';

const App = () => {
  socket.on('playerTwoHasJoined', () => console.log('PLAYER TWO HAS ENTERED THE ARENA!'));
  socket.on('playerHasRejoined', () => console.log('YOUR OPPONENT HAS RETURNED TO THE ARENA!'));
  
  return <AppRouter />
}

export default App;
