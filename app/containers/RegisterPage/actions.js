/*
 *
 * RegisterPage actions
 *
 */

import {
  DEFAULT_ACTION,
  REGISTER_REQUEST
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function registerRequest(data) {
  return { type: REGISTER_REQUEST, data }
}
