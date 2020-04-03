import React from 'react';

import socket from './socket/socket';
import AppRouter from './components/AppRouter';

import './App.css';

const App = () => {
  socket.on('playerTwoHasJoined', () => console.log('PLAYER TWO HAS ENTERED THE ARENA!'));
  
  return <AppRouter />
}

export default App;
