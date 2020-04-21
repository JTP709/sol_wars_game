import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import socket from '../socket/socket';
import { useHistory } from 'react-router-dom';

import {
  setGameId,
  setRedPlayer,
  setBluePlayer,
  setGameInProgressTrue,
  setGameInProgressFalse
} from '../redux/actions';

import AppRouter from './AppRouter';

const mapDispatchToProps = {
  setGameId,
  setRedPlayer,
  setBluePlayer,
  setGameInProgressTrue,
  setGameInProgressFalse
};

const SocketController = ({
  setGameId,
  setRedPlayer,
  setBluePlayer,
  setGameInProgressTrue,
  setGameInProgressFalse
}) => {
  const history = useHistory();
  
  const setPlayerNames = data => {
    data.redPlayerName && setRedPlayer(data.redPlayerName);
    data.bluePlayerName && setBluePlayer(data.bluePlayerName);
  }
  
  useEffect(() => {
    socket.on('gameStartSuccess', data => {
      setPlayerNames(data);
      setGameId(data.gameId);
      setGameInProgressTrue();
      console.log('LET THE GAMES BEGIN!', data.gameId);
      history.push('/warroom')
    });
  
    socket.on('gameStartError', () => console.error('There was an error on the server while trying to start the game.'));
  
    socket.on('joinGameSuccess', data => {
      setPlayerNames(data);
      setGameId(data.gameId);
      setGameInProgressTrue();
      console.log('TIME TO TEACH PLAYER ONE A LESSON!');
      history.push('/warroom')
    });

    socket.on('joinedGameInProgressSuccess', data => {
      setPlayerNames(data);
      setGameId(data.gameId);
      setGameInProgressTrue();
      console.log('YOU HAVE RETURNED TO THE MATCH!');
      history.push('/warroom');
    });
  
    socket.on('gameDoesNotExist', () =>{
      console.log('That Game does not exist or is no longer in progress.')
    });
  
    socket.on('gameJoinError', () => console.error('There was an error on the server while trying to join the game.'));
  
    socket.on('playerHasJoined', data => { 
      console.log('PLAYER TWO HAS ENTERED THE ARENA!');
      setPlayerNames(data);
      setGameInProgressTrue();
    });
    
    socket.on('playerHasRejoined', data => {
      console.log('YOUR OPPONENT HAS RETURNED TO THE ARENA!');
      setPlayerNames(data);
      setGameInProgressTrue();
    });
  
    socket.on('playerDisconnected', () => {
      console.log('Your opponent has disconnected.');
      setGameInProgressFalse();
    });
  
    socket.on('playerLeft', () => {
      console.log('Your opponent has left the match.');
      setGameInProgressFalse();
    });

    return () => {
      socket.off('gameStartSuccess');
      socket.off('gameStartError');
      socket.off('joinGameSuccess');
      socket.off('joinedGameInProgressSuccess');
      socket.off('gameDoesNotExist');
      socket.off('gameJoinError');
      socket.off('playerHasJoined');
      socket.off('playerHasRejoined');
      socket.off('playerDisconnected');
      socket.off('playerLeft');
    }
  });
  


  return <AppRouter />
}

export default connect(null, mapDispatchToProps)(SocketController)
