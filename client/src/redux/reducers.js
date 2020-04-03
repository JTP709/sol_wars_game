import { ACTIONS } from './constants';

const defaultState = {
  isSignedIn: false,
  playerId: null,
  gameId: null,
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
      return {
        ...defaultState,
        signInError: action.payload.error
      }
    case ACTIONS.SIGNOUT_SUCCESS:
      return {
        ...defaultState
      }
    case ACTIONS.SET_GAME_ID:
      return{
        ...state,
        gameId: action.payload.gameId
      }
    default:
      return state
  }
}
