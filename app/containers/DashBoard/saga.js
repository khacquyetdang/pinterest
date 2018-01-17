/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put, select } from 'redux-saga/effects';
import { ADD_PHOTO_REQUEST, ADD_PHOTO_ERROR, ADD_PHOTO_SUCCESS } from './constants';
import { SHOW_NOTIFICATION } from '../App/constants';
import request from 'utils/request';
import { showProgressLog } from 'utils/Logger';
import { getToken } from 'utils/store';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth';
import { push } from 'react-router-redux';
import { photoUrl } from 'config';
import { setAuth } from './../App/actions';
import HttpStatus from 'http-status-codes';

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
      yield put({ type: ADD_PHOTO_SUCCESS });
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
  yield put(setAuth(null));
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
  //yield takeEvery("LOGOUT", logout)
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
