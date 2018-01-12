/*
 *
 * RegisterPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  REGISTER_ERROR,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_RESET
} from './constants';

const initialState = fromJS({
  error: null,
  currentlySending: false,
  accountCreated: false,
});

function registerPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case REGISTER_RESET:
      return initialState;
    case REGISTER_REQUEST:
      return state.set('error', null)
        .set('currentlySending', true)
        .set('accountCreated', false);
    case REGISTER_SUCCESS:
      return state.set('error', null)
        .set('currentlySending', false)
        .set('accountCreated', true);
    case REGISTER_ERROR:
      return state.set('error', action.error)
        .set('currentlySending', false)
        .set('accountCreated', false);
    default:
      return state;
  }
}

export default registerPageReducer;
