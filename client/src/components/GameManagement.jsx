import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import socket from '../socket/socket';

import { getPlayerId } from '../redux/selectors';
import { setGameId } from '../redux/actions';

const mapStateToProps = state => ({
  playerId: getPlayerId(state)
});

const mapDispatchToProps = {
  setGameId
}

const GameManagement = ({ playerId, setGameId }) => {
  const [joinGameId, setJoinGameId] = useState('');
  const token = localStorage.getItem('token');
  const history = useHistory();
  
  const startGame = () => {
    console.log('starting game ...')
    socket.emit('startGameRequest', {token, playerId});
    socket.on('gameStartSuccess', data => {
      setGameId({ gameId: data.gameId });
      console.log('LET THE GAMES BEGIN!', data.gameId);
      history.push('/warroom')
    });
    socket.on('gameStartError', () => console.error('There was an error on the server while trying to start the game.'));
  }
  
  const joinGame = event => {
    event.preventDefault();
    socket.emit('joinGameRequest', { token, playerId, gameId: joinGameId });
    socket.on('joinGameSuccess', data => {
      setGameId({ gameId: data.gameId });
      console.log('TIME TO TEACH PLAYER ONE A LESSON!');
      history.push('/warroom')
    });
    socket.on('gameJoinError', () => console.error('There was an error on the server while trying to join the game.'));
  }

  const handleChange = event => {
    setJoinGameId(event.target.value);
  }

  return <div>
    <button onClick={startGame}>Start A New Game</button>
    <hr/>
    <form onSubmit={joinGame}>
      <label>
        Game ID:
        <input type='text' value={joinGameId} onChange={handleChange} />
      </label>
      <button type='submit' value='Submit'>Join Game</button>
    </form>
  </div>
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameManagement);
