import { ACTIONS } from './constants';

export const signInSuccess = () => ({ type: ACTIONS.SIGNIN_SUCCESS });

export const signInFailure = () => ({ type: ACTIONS.SIGNIN_FAILURE });

export const signOutSuccess = () => ({ type: ACTIONS.SIGNOUT_SUCCESS });
