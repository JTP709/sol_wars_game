import React from 'react';
import { connect } from 'react-redux';

import { getGameId, getRedPlayer, getBluePlayer } from '../redux/selectors';

import './WarRoom.css';

const mapStateToProps = state => ({
  gameId: getGameId(state),
  redPlayer: getRedPlayer(state),
  bluePlayer: getBluePlayer(state)
})

const WarRoom = ({ gameId, redPlayer, bluePlayer }) => {

  return <div>
    <h1>WAR ROOM</h1>
    <h2><i>"There's no fighting in the war room!"</i></h2>
    {/* { <h2>WAITING FOR OPPOSING PLAYER TO JOIN</h2> } */}
    <div>
      <h3>Red Team Commander: { redPlayer }</h3>
      <h3>Blue Team Commander: { bluePlayer }</h3>
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
    </div>
  </div>
}

export default connect(mapStateToProps)(WarRoom);