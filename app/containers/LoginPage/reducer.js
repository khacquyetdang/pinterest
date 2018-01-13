/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_RESET
} from './constants';

const initialState = fromJS({
  error: null,
  currentlySending: false,
  loginOk: false,
});

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case LOGIN_RESET:
      return initialState;
    case LOGIN_REQUEST:
      return state.set('error', null)
        .set('currentlySending', true)
        .set('loginOk', false);
    case LOGIN_SUCCESS:
      return state.set('error', null)
        .set('currentlySending', false)
        .set('loginOk', true);
    case LOGIN_ERROR:
      return state.set('error', action.error)
        .set('currentlySending', false)
        .set('loginOk', false);
    default:
      return state;
  }
}

export default loginPageReducer;
