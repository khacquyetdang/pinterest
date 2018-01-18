/*
 *
 * DashBoard actions
 *
 */

import {
  DEFAULT_ACTION,
  ADD_PHOTO_REQUEST,
  DELETE_PHOTOS_REQUEST
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}


export function deletePhotoRequest(photoId) {
  return {
    type: DELETE_PHOTOS_REQUEST,
    photoId,
  }
};

export function addPhotoRequest(url, description) {
  return {
    type: ADD_PHOTO_REQUEST,
    url,
    description
  }
};