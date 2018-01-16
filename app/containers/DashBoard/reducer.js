/*
 *
 * DashBoard reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  ADD_PHOTO_ERROR,
  ADD_PHOTO_REQUEST,
  ADD_PHOTO_SUCCESS,
  HIDE_MODAL,
  SHOW_MODAL
} from './constants';
import { CLEAR_NOTIFICATION } from '../App/constants';

const initialState = fromJS({
  showModal: false,
  loading: false,
  error: null,
  notif_add_photo_ok: false,
});


function dashBoardReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SHOW_MODAL:
      return state.set('showModal', true);
    case HIDE_MODAL:
      return state.set('showModal', false);
    case ADD_PHOTO_REQUEST:
      return state.set("loading", true)
        .set("error", null)
        .set("notif_add_photo_ok", false);
    case ADD_PHOTO_ERROR:
      return state.set("loading", false)
        .set("error", action.error)
        .set("notif_add_photo_ok", false);
    case ADD_PHOTO_SUCCESS:
      return state.set("loading", false)
        .set("error", null)
        .set("notif_add_photo_ok", true)
        .set('showModal', false);
    case CLEAR_NOTIFICATION:
      return initialState;
    default:
      return state;
  }
}

export default dashBoardReducer;
