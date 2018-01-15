/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEFAULT_ACTION,
  GET_PHOTOS_ERROR,
  GET_PHOTOS_SUCCESS,
  GET_PHOTOS_REQUEST
} from './constants';

const initialState = fromJS({
  loading: false,
  error: null,
  photos: []
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_PHOTOS_REQUEST:
      return state.set('loading', true)
        .set('error', null);
    case GET_PHOTOS_SUCCESS:
      return state.set('loading', false)
        .set('photos', action.photos)
        .set('error', null);
    case GET_PHOTOS_ERROR:
      return state.set('loading', false)
        .set('error', action.error);
    default:
      return state;
  }
}

export default homePageReducer;
