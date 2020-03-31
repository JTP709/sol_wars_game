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
    case ACTIONS.SIGNOUT_SUCCESS:
      return {
        ...state,
        isSignedIn: false,
        playerId: null
      }
    case ACTIONS.SET_GAME_ID:
      return{
        ...state,
        gameId: payload.gameId
      }
    default:
      return state
  }
}
