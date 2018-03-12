/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put, select } from 'redux-saga/effects';
import { ADD_PHOTO_REQUEST, ADD_PHOTO_ERROR, ADD_PHOTO_SUCCESS,
GET_PHOTOS_ERROR, GET_PHOTOS_REQUEST, GET_PHOTOS_SUCCESS,
DELETE_PHOTOS_ERROR, DELETE_PHOTOS_REQUEST, DELETE_PHOTOS_SUCCESS } from './constants';
import { SHOW_NOTIFICATION } from '../App/constants';
import request,  { requestText } from 'utils/request';
import { showProgressLog } from 'utils/logger';
import { getToken, getLocale } from 'utils/store';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth';
import { push } from 'react-router-redux';
import { photoUrl, myphotoUrl } from 'config';

import { setAuth } from './../App/actions';
import HttpStatus from 'http-status-codes';

export function* fetchPhotos(action) {
  // Select username from store
  try {
    var access_token = yield select(getToken);
    var locale = yield select(getLocale);
    var options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + access_token

      },
      mode: 'cors',
    }
    var url = myphotoUrl + "?" + locale;
    const response = yield call(request, url, options);
    showProgressLog(url, response, "photos");
    if (!response) {
      yield put({ type: GET_PHOTOS_ERROR, error: "Unknow error" });
    }
    else if (response.status === HttpStatus.UNAUTHORIZED) {
      yield put({ type: "LOGOUT" });
    }
    else if (response.photos) {
      yield put({ type: GET_PHOTOS_SUCCESS, photos: response.photos });
    }
    else {
      yield put({ type: GET_PHOTOS_ERROR, error: response.error || "Unhandle error"});
    }
  } catch (err) {
    yield put({ type: GET_PHOTOS_ERROR, error: { msg: err } });
    //showProgressLog(err);
  }
}

export function* fetchDelete(action) {
  // Select username from store
  try {
    var access_token = yield select(getToken);
    var locale = yield select(getLocale);
    var options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + access_token
      },
      mode: 'cors',
    }

    var url = photoUrl + "/" + action.photoId + "?" + locale;;
    const response = yield call(request, url, options);
    showProgressLog(url, response, "deletePhoto");
    if (!response) {
      yield put({ type: DELETE_PHOTOS_ERROR, error: "Unknow error" });
      yield put({
        type: SHOW_NOTIFICATION
        , message: "Network error"
      });
    }
    // already logout
    else if (response && response.status === HttpStatus.UNAUTHORIZED) {
      yield put({ type: "LOGOUT" });
      // add logout notification
    }
    else if (response && response.error) {
      yield put({ type: DELETE_PHOTOS_ERROR, error: response.error });
    }

    if (response.photos) {
      yield put({ type: DELETE_PHOTOS_SUCCESS });
      yield put({ type: SET_PHOTOS, photos: response.photos });
    }
  } catch (err) {
    yield put({ type: DELETE_PHOTOS_ERROR, error: { msg: err } });
    yield put({ type: SHOW_NOTIFICATION, message: err });
    //showProgressLog(err);
  }
}


export function* fetchAddPhoto(action) {
  // Select username from store
  try {
    var access_token = yield select(getToken);

    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + access_token
      },
      mode: 'cors',
    }
    var data = {
      url: action.url,
      description: action.description
    };

    options.body = JSON.stringify(data);


    const response = yield call(request, photoUrl, options);
    showProgressLog(photoUrl, response, "DashBoardSaga");
    if (!response) {
      yield put({
        type: LOGOUT_ERROR, error: {
          msg: "Unknow error"
        }
      });
      yield put({
        type: SHOW_NOTIFICATION
        , message: "Network error"
      });
    }
    //  acess token not valid
    else if (response.status === HttpStatus.UNAUTHORIZED) {
      yield put({ type: "LOGOUT" });
    }
    else if (response.error) {
      yield put({ type: ADD_PHOTO_ERROR, error: response.error });
    }
    else {
      yield put({ type: ADD_PHOTO_SUCCESS, photos: response.photos });
      yield put({ type: SHOW_NOTIFICATION, message: response.msg });

    }
  } catch (err) {
    yield put({ type: ADD_PHOTO_ERROR, error: { msg: err } });
    yield put({ type: SHOW_NOTIFICATION, message: err });
    //showProgressLog(err);
  }
}

export function* logout() {
  updateLocalStorage(
    {
      access_token: null
    }
  );
  yield put({ type: LOGOUT_SUCCESS });
  yield put(setAuth(null, null));
  yield put({
    type: SHOW_NOTIFICATION
    , message: "Vous êtes déconnecté du site"
  });
}

export function* goToPage(context, action) {

  if (action.page) {
    //yield call(context.router.transitionTo, action.page);
    window.location.href = '/#' + action.page;
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* dashBoardFlow(context) {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeEvery(ADD_PHOTO_REQUEST, fetchAddPhoto);
  yield takeEvery(GET_PHOTOS_REQUEST, fetchPhotos);
  yield takeEvery(DELETE_PHOTOS_REQUEST, fetchDelete);

  //yield takeEvery("LOGOUT", logout)
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
