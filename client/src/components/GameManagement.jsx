import React from 'react';
import { connect } from 'react-redux';
import socket from '../socket/socket';

import { getPlayerId } from '../redux/selectors';
import { setGameId } from '../redux/actions;'

const mapStateToProps = state => ({
  playerId: getPlayerId(state)
});

const mapDispatchToProps = {
  setGameId
}

const GameManagement = ({ playerId, setGameId }) => {
  const token = localStorage.getItem('token');
  const startGame = () => {
    console.log('starting game ...')
    socket.emit('startGame', {token, playerId});
    socket.on('gameStartSuccess', data => {
      setGameId({ gameId: data.gameId });
      socket.join(data.gameId);
      console.log('LET THE GAMES BEGIN!', data.gameId)
    });
    socket.on('gameStartError', () => console.error('There was an error on the server while trying to start the game.'));
  }
  return <div>
    <button onClick={startGame}>Start A New Game</button>
    <hr/>
    <form>
      <label>
        Game ID:
        <input type='text' name='gameId'/>
      </label>
      <button type='submit' >Join Game</button>
    </form>
  </div>
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameManagement);
