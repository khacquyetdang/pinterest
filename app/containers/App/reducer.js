/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOGOUT_ERROR,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  SET_AUTH
} from './constants';

// The initial state of the App
const initialState = fromJS({
  access_token: null,
  loading: false,
  loading_logout : false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT_REQUEST:
      return state
        .set('loading_logout', true);
    case LOGOUT_SUCCESS:
      return state
        .set('error', null)
        .set('loading_logout', false);
    case LOGOUT_ERROR:
      return state
        .set('error', action.error)
        .set('loading_logout', false);
    case SET_AUTH:
      return state
        .set('access_token', action.access_token);
    default:
      return state;
  }
}

export default appReducer;
