/*
 *
 * DashBoard actions
 *
 */

import {
  DEFAULT_ACTION,
  ADD_PHOTO_REQUEST,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function addPhotoRequest(url) {
  return {
    type: ADD_PHOTO_REQUEST,
    url
  }
};