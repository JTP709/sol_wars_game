import { ACTIONS } from './constants';

const defaultState = {
  isSignedIn: false,
  playerId: null,
  gameId: null,
  redTeamCommander: '',
  blueTeamCommander: '',
  playerUserName: ''
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
    case ACTIONS.SET_PLAYER_USER_NAME:
      return {
        ...state,
        playerUserName: action.payload.userName
      }
    case ACTIONS.SET_RED_TEAM_COMMANDER:
      return {
        ...state,
        redTeamCommander: action.payload.userName
      }
    case ACTIONS.SET_BLUE_TEAM_COMMANDER:
      return {
        ...state,
        blueTeamCommander: action.payload.userName
      }
    default:
      return state
  }
}
