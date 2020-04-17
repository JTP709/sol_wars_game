import axios from 'axios';
import { ACTIONS } from './constants';


// Authentication and Sign in

export const signInSuccess = playerId => ({
  type: ACTIONS.SIGNIN_SUCCESS,
  payload: { playerId }
});

export const signInFailure = error => ({ type: ACTIONS.SIGNIN_FAILURE, payload: { error } });

export const signOutSuccess = () => ({ type: ACTIONS.SIGNOUT_SUCCESS });

export const validateGoogleSignIn = payload => {
  const { tokenId, googleId, profileObj: { email, name} } = payload;
  const data = {
    name,
    email,
    googleId
  };
  const config = {
    headers: { 'authorization': tokenId, 'userid': googleId }
  };

  return dispatch => {
    axios.post(
      'http://localhost:9000/users',
      data,
      config
    ).then (() => {
      dispatch(signInSuccess(googleId))
    }).catch(error => {
      console.error('google_validate_sign_in_error: ', error);
      dispatch(signInFailure(error));
    });
  };
};

// Game Setup

export const setGameId = gameId => ({
  type: ACTIONS.SET_GAME_ID,
  payload: { gameId }
});

export const resetGameId = () => ({ type: ACTIONS.RESET_GAME_ID });

export const setPlayerUserName = userName => ({
  type: ACTIONS.SET_PLAYER_USER_NAME,
  payload: { userName }
})

export const setRedTeamCommander = userName => ({
type: ACTIONS.SET_RED_TEAM_COMMANDER,
payload: { userName }
});

export const setBlueTeamCommander = userName => ({
  type: ACTIONS.SET_BLUE_TEAM_COMMANDER,
  payload: { userName }
});
