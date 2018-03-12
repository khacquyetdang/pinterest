/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put, select } from 'redux-saga/effects';
import {
  LOGOUT_REQUEST, LOGOUT_ERROR, LOGOUT_SUCCESS, SHOW_NOTIFICATION,
  VOTE_PHOTO_REQUEST, VOTE_PHOTO_ERROR, VOTE_PHOTO_SUCCESS
} from './constants';
import { SET_PHOTOS } from './../HomePage/constants';
import request from 'utils/request';
import { showProgressLog } from 'utils/logger';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth'app;
import { push } from 'react-router-redux';
import { logoutUrl, voteUrl } from 'config';
import { setAuth } from './actions';
import HttpStatus from 'http-status-codes';
import { getToken, getLocale } from 'utils/store';

export function* fetchLogout(action) {
  // Select username from store
  try {
    var access_token = yield select(getToken);
    var options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + access_token
      },
      mode: 'cors',
    }

    const response = yield call(request, logoutUrl, options);
    showProgressLog(logoutUrl, response, "logoutSaga");
    if (!response) {
      yield put({ type: LOGOUT_ERROR, error: "Unknow error" });
      yield put({
        type: SHOW_NOTIFICATION
        , message: "Network error"
      });
    }
    // already logout
    else if (response && response.status === HttpStatus.UNAUTHORIZED) {
      yield put({ type: "LOGOUT" });
    }
    else if (response && response.error) {
      yield put({ type: LOGOUT_ERROR, error: response.error });
    }
    else {
      yield put({ type: "LOGOUT" });
    }
  } catch (err) {
    yield put({ type: LOGOUT_ERROR, error: { msg: err } });
    yield put({ type: SHOW_NOTIFICATION, message: err });
    //showProgressLog(err);
  }
}

export function* fetchVote(action) {
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

    var url = voteUrl + action.photoId;
    const response = yield call(request, url, options);
    showProgressLog(url, response, "fetchVote");
    if (!response) {
      yield put({ type: VOTE_PHOTO_ERROR, error: "Unknow error" });
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
      yield put({ type: VOTE_PHOTO_ERROR, error: response.error });
    }

    if (response.photos) {
      yield put({ type: VOTE_PHOTO_SUCCESS, photos: response.photos });
      yield put({ type: SET_PHOTOS, photos: response.photos });
    }
  } catch (err) {
    yield put({ type: VOTE_PHOTO_ERROR, error: { msg: err } });
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
export default function* appFlow(context) {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeEvery(LOGOUT_REQUEST, fetchLogout);
  yield takeEvery(VOTE_PHOTO_REQUEST, fetchVote);
  yield takeEvery("LOGOUT", logout)
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
