/*
 *
 * HomePage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PHOTOS_REQUEST
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}


export function getPhotoRequest(locale) {
  return {
    type: GET_PHOTOS_REQUEST,
    locale
  };
}


