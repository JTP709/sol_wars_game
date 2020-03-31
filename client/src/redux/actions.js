import axios from 'axios';
import { ACTIONS } from './constants';

export const signInSuccess = payload => ({
  type: ACTIONS.SIGNIN_SUCCESS,
  payload
});

export const signInFailure = () => ({ type: ACTIONS.SIGNIN_FAILURE });

export const signOutSuccess = () => ({ type: ACTIONS.SIGNOUT_SUCCESS });

export const validateGoogleSignIn = response => {
  const { tokenId, googleId, profileObj: { email, name} } = response;
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
      dispatch(signInSuccess({ playerId: googleId }))
    }).catch(() => {
      console.log("catch")
      dispatch(signInFailure())
    });
  };
};
