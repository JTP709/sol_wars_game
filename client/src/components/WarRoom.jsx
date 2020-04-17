import React from 'react';
import { connect } from 'react-redux';

import { getGameId, getRedTeamCommander, getBlueTeamCommander } from '../redux/selectors';

import './WarRoom.css';

const mapStateToProps = state => ({
  gameId: getGameId(state),
  redTeamCommander: getRedTeamCommander(state),
  blueTeamCommander: getBlueTeamCommander(state)
})

const WarRoom = ({ gameId, redTeamCommander, blueTeamCommander }) => {

  return <div>
    <h1>WAR ROOM</h1>
    <h2><i>"There's no fighting in the war room!"</i></h2>
    <div>
      <h3>Red Team Commander: { redTeamCommander }</h3>
      <h3>Blue Team Commander: { blueTeamCommander }</h3>
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