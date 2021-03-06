/*
 *
 * DashBoard reducer
 *
 */

import {fromJS} from 'immutable';
import {
  DEFAULT_ACTION,
  ADD_PHOTO_ERROR,
  ADD_PHOTO_REQUEST,
  ADD_PHOTO_SUCCESS,
  HIDE_MODAL,
  SHOW_MODAL,
  GET_PHOTOS_SUCCESS,
  DELETE_PHOTOS_SUCCESS,
  GET_PHOTOS_REQUEST,
  GET_PHOTOS_ERROR,
  CLEAR_PHOTO_ERROR,
  SET_ID_USER
} from './constants';
import {CLEAR_NOTIFICATION, VOTE_PHOTO_SUCCESS} from '../App/constants';

const initialState = fromJS({showModal: false,
  id_user: null, loading: false, error: null, notif_add_photo_ok: false, photos: []});

function dashBoardReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_ID_USER:
      return state.set('id_user', action.id_user);
    case SHOW_MODAL:
      return state.set('showModal', true);
    case HIDE_MODAL:
      return state.set('showModal', false);
    case ADD_PHOTO_REQUEST:
      return state
        .set("loading", true)
        .set("error", null)
        .set("notif_add_photo_ok", false);
    case ADD_PHOTO_ERROR:
      return state
        .set("loading", false)
        .set("error", action.error)
        .set("notif_add_photo_ok", false);
    case ADD_PHOTO_SUCCESS:
      return state
        .set("loading", false)
        .set("error", null)
        .set("notif_add_photo_ok", true)
        .set("photos", action.photos)
        .set('showModal', false);
    case DELETE_PHOTOS_SUCCESS:
      return state
        .set("loading", false)
        .set("error", null)
        .set("photos", action.photos)
        .set('showModal', false);
    case CLEAR_PHOTO_ERROR:
      return state.set("error", null);
    case GET_PHOTOS_REQUEST:
      return state
        .set('loading', true)
        .set('error', null);
    case GET_PHOTOS_SUCCESS:
      return state
        .set('loading', false)
        .set('photos', action.photos)
        .set('error', null);
    case VOTE_PHOTO_SUCCESS: 
      {
        var photos = action.photos.filter(photo => {
          return photo.owner._id === state.get('id_user');
        });
        return state.set('photos', photos);
      }
    case GET_PHOTOS_ERROR:
      return state
        .set('loading', false)
        .set('error', action.error);
    case CLEAR_NOTIFICATION:
      return state.set('notif_add_photo_ok', false);
    default:
      return state;
  }
}

export default dashBoardReducer;
