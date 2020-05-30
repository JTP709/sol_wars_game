import React from 'react';
import { connect } from 'react-redux';

import {
  getGameId,
  getRedPlayer,
  getBluePlayer,
  getTurn,
  getIsCurrentPlayer,
  getAreBothPlayersPresent,
  getPlayerId
} from '../redux/selectors';

import './WarRoom.css';
import socket from '../socket/socket';

const mapStateToProps = state => ({
  gameId: getGameId(state),
  redPlayer: getRedPlayer(state),
  bluePlayer: getBluePlayer(state),
  turn: getTurn(state),
  isCurrentPlayer: getIsCurrentPlayer(state),
  areBothPlayersPresent: getAreBothPlayersPresent(state),
  playerId: getPlayerId(state)
});

const WarRoom = ({
  gameId,
  redPlayer,
  bluePlayer,
  turn,
  isCurrentPlayer,
  areBothPlayersPresent,
  playerId,
}) => {
  const token = localStorage.getItem('token');

  const submitTurn = event => {
    event.preventDefault();
    socket.emit('nextTurnSubmitted', { token, gameId, playerId })
  }

  const interactive = areBothPlayersPresent && isCurrentPlayer;

  return <div>
    <h1>WAR ROOM</h1>
    <h2><i>"There's no fighting in the war room!"</i></h2>
    {
      !areBothPlayersPresent && <h2>WAITING FOR OPPOSING PLAYER TO JOIN</h2>
    }
    {
      areBothPlayersPresent && (isCurrentPlayer ? <h2>Your Turn</h2> : <h2>Waiting on your opponent</h2>)
    }
    <div>
      <h3>Red Team Commander: { redPlayer }</h3>
      <h3>Blue Team Commander: { bluePlayer }</h3>
      <h3>Turn: { turn }</h3>
      <h3>Game ID: { gameId }</h3>
      <table>
        <thead>
          <tr>
            <th colSpan='4'>System Map</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>The Union</th>
            <th>The Collective</th>
            <th>The Bloc</th>
            <th>The Order</th>
          </tr>
          <tr>
            <td>Earth</td>
            <td>Mercury</td>
            <td>Mars</td>
            <td>Europa</td>
          </tr>
          <tr>
            <td>Moon</td>
            <td>Venus</td>
            <td>Belt</td>
            <td>Io</td>
          </tr>
          <tr>
            <td>Colonies</td>
            <td>Forge</td>
            <td>Phobos</td>
            <td>Ganymede</td>
          </tr>
        </tbody>
      </table>
      <button disabled={!interactive} onClick={ submitTurn }>Next Turn</button>
    </div>
  </div>
}

export default connect(mapStateToProps)(WarRoom);