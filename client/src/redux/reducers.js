import { ACTIONS } from './constants';

const defaultState = {
  isSignedIn: false
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case ACTIONS.SIGNIN_SUCCESS:
      return {
        ...state,
        isSignedIn: true
      }
    case ACTIONS.SIGNIN_FAILURE:
    case ACTIONS.SIGNOUT_SUCCESS:
      return {
        ...state,
        isSignedIn: false
      }
    default:
      return state
  }
}
