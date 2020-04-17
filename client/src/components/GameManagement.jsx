import React, { useState } from 'react';
import { connect } from 'react-redux';
import socket from '../socket/socket';

import { getPlayerId, getGameId } from '../redux/selectors';
import {
  resetGameId,
  setPlayerUserName
} from '../redux/actions';

const mapStateToProps = state => ({
  playerId: getPlayerId(state),
  gameId: getGameId
});

const mapDispatchToProps = {
  resetGameId,
  setPlayerUserName
}

const GameManagement = ({
  playerId,
  resetGameId,
  gameId,
  setPlayerUserName
}) => {
  const [joinGameId, setJoinGameId] = useState('');
  const [joinGameName, setJoinGameName] = useState('');
  const [startGameName, setStartGameName] = useState('');
  const token = localStorage.getItem('token');
  
  const startGame = event => {
    event.preventDefault();
    console.log('starting game ...')
    setPlayerUserName(startGameName);
    socket.emit('startGameRequest', {token, playerId, playerUserName: startGameName});
  }
  
  const joinGame = event => {
    event.preventDefault();
    setPlayerUserName(joinGameName);
    socket.emit('joinGameRequest', { token, playerId, gameId: joinGameId, playerUserName: joinGameName });
  }

  const handleStartNameChange = event => setStartGameName(event.target.value);
  
  const handleJoinGameIdChange = event => setJoinGameId(event.target.value);

  const handleJoinGameNameChange = event => setJoinGameName(event.target.value);

  const leaveGame = () => resetGameId();

  return <div>
    { gameId ? <button onClick={leaveGame}>Leave Game</button> : null }
    <form onSubmit={startGame}>
      <label>
        Name:
        <input type='text' value={startGameName} onChange={handleStartNameChange} />
      </label>
      <button type='submit' value='Submit'>Start A New Game</button>
    </form>
    <hr/>
    <form onSubmit={joinGame}>
      <label>
        Game ID:
        <input type='text' value={joinGameId} onChange={handleJoinGameIdChange} />
      </label>
      <label>
        Name:
        <input type='text' value={joinGameName} onChange={handleJoinGameNameChange} />
      </label>
      <button type='submit' value='Submit'>Join Game</button>
    </form>
  </div>
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameManagement);
