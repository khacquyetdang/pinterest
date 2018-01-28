/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put } from 'redux-saga/effects';
import { GET_PHOTOS_ERROR, GET_PHOTOS_REQUEST, GET_PHOTOS_SUCCESS } from './constants';
import request from 'utils/request';
import { showProgressLog } from 'utils/logger';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth';
import { push } from 'react-router-redux';
import { photoUrl } from 'config';

export function* fetchPhotos(action) {
  // Select username from store
  try {

    var options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8',
      },
      mode: 'cors',
    }
    var url = photoUrl + "?" + action.locale;
    const response = yield call(request, url, options);
    showProgressLog(url, response, "photos");
    if (!response) {
      yield put({ type: GET_PHOTOS_ERROR, error: "Unknow error" });
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
  yield takeEvery(GET_PHOTOS_REQUEST, fetchPhotos);
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
