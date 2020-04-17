import React from 'react';
import { connect } from 'react-redux';
import socket from '../socket/socket';
import { useHistory } from 'react-router-dom';

import {
  setGameId,
  setRedTeamCommander,
  setBlueTeamCommander
} from '../redux/actions';

import { getPlayerUserName } from '../redux/selectors';

import AppRouter from './AppRouter';

const mapStateToProps = state => ({
  playerUserName: getPlayerUserName(state)
});

const mapDispatchToProps = {
  setGameId,
  setRedTeamCommander,
  setBlueTeamCommander
};

const SocketController = ({
  playerUserName,
  setGameId,
  setRedTeamCommander,
  setBlueTeamCommander
}) => {
  const history = useHistory();

  socket.on('gameStartSuccess', data => {
    setRedTeamCommander(playerUserName);
    setGameId(data.gameId);
    console.log('LET THE GAMES BEGIN!', data.gameId);
    history.push('/warroom')
  });

  socket.on('gameStartError', () => console.error('There was an error on the server while trying to start the game.'));

  socket.on('joinGameSuccess', data => {
    console.log('Join Game Data: ', data);
    setBlueTeamCommander(playerUserName);
    setRedTeamCommander(data.opponentUserName);
    setGameId(data.gameId);
    console.log('TIME TO TEACH PLAYER ONE A LESSON!');
    history.push('/warroom')
  });
  socket.on('joinedGameInProgressSuccess', data => {
    console.log('JIP data: ', data)
    setBlueTeamCommander(playerUserName);
    setRedTeamCommander(data.opponentUserName);
    setGameId(data.gameId);
    console.log('YOU HAVE RETURNED TO THE MATCH!');
    history.push('/warroom');
  });

  socket.on('gameDoesNotExist', () =>{
    console.log('That Game does not exist or is no longer in progress.')
  });

  socket.on('gameJoinError', () => console.error('There was an error on the server while trying to join the game.'));

  socket.on('playerTwoHasJoined', data => { 
    console.log('player two joined data: ', data);
    console.log('PLAYER TWO HAS ENTERED THE ARENA!');
    setBlueTeamCommander(data.opponentUserName);
  });
  
  socket.on('playerHasRejoined', data => {
    console.log('player two has RE joined data: ', data);
    console.log('YOUR OPPONENT HAS RETURNED TO THE ARENA!');
    setBlueTeamCommander(data.opponentUserName);
  });

  return <AppRouter />
}

export default connect(mapStateToProps, mapDispatchToProps)(SocketController)
