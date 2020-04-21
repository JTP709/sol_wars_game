import { ACTIONS } from './constants';

const defaultState = {
  isSignedIn: false,
  playerId: null,
  gameId: null,
  inProgress: false,
  turn: 0,
  redPlayer: '',
  bluePlayer: ''
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
      return {
        ...state,
        gameId: action.payload.gameId
      }
    case ACTIONS.RESET_GAME_ID:
      return {
        ...state,
        gameId: null
      }
    case ACTIONS.SET_RED_PLAYER:
      return {
        ...state,
        redPlayer: action.payload.userName
      }
    case ACTIONS.SET_BLUE_PLAYER:
      return {
        ...state,
        bluePlayer: action.payload.userName
      }
    case ACTIONS.INCREMENT_TURN:
      return {
        ...state,
        turn: state.turn++
      }
    case ACTIONS.SET_GAME_IN_PROGRESS_TRUE:
      return {
        ...state,
        inProgress: true
      }
    case ACTIONS.SET_GAME_IN_PROGRESS_FALSE:
      return {
        ...state,
        inProgress: false
      }
    case ACTIONS.RESET_GAME_STATE:
      return {
        ...defaultState,
        isSignedIn: state.isSignedIn,
        playerId: state.playerId,
      }
    default:
      return state
  }
}
