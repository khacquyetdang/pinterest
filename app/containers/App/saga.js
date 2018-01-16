/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put } from 'redux-saga/effects';
import { LOGOUT_REQUEST, LOGOUT_ERROR, LOGOUT_SUCCESS } from './constants';
import request from 'utils/request';
import { showProgressLog } from 'utils/Logger';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth';
import { push } from 'react-router-redux';
import { logoutUrl } from 'config';
import { setAuth } from './actions';
import HttpStatus from 'http-status-codes';
export function* fetchLogout(action) {
  // Select username from store
  try {

    var options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + action.access_token
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
      yield put({ type : "LOGOUT"});
    }
    else if (response && response.error) {
      yield put({ type: LOGOUT_ERROR, error: response.error });
    }
    else {
      yield put({ type : "LOGOUT"});
    }
  } catch (err) {
    yield put({ type: LOGOUT_ERROR, error: { msg: err } });
    yield put({ type: SHOW_NOTIFICATION, message: err });
    //showProgressLog(err);
  }
}

export function *logout() {
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
export default function* appFlow(context) {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeEvery(LOGOUT_REQUEST, fetchLogout);
  yield takeEvery("LOGOUT", logout)
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
