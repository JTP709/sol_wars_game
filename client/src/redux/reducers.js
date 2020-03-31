import { ACTIONS } from './constants';

const defaultState = {
  isSignedIn: false,
  playerId: null,
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case ACTIONS.SIGNIN_SUCCESS:
      return {
        ...state,
        isSignedIn: true,
        playerId: action.payload.playerId
      }
    case ACTIONS.SIGNIN_FAILURE:
    case ACTIONS.SIGNOUT_SUCCESS:
      return {
        ...state,
        isSignedIn: false,
        playerId: null
      }
    default:
      return state
  }
}
