/*
 *
 * LoginPage actions
 *
 */

import {
  DEFAULT_ACTION,
  LOGIN_REQUEST
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loginRequest(data) {
  return { type: LOGIN_REQUEST, data }
}
