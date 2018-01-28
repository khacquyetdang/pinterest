/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put } from 'redux-saga/effects';
import { LOGIN_REQUEST, LOGIN_ERROR, LOGIN_SUCCESS, LOGIN_RESET, LOGIN_FACEBOOK_REQUEST } from './constants';
import request,  { requestText } from 'utils/request';
import { showProgressLog } from 'utils/logger';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth';
import { push } from 'react-router-redux';
import { loginUrl, authWithFaceBookTokenUrl } from 'config';
import { setAuth } from './../App/actions';

export function* fetchLogin(action) {
  // Select username from store
  try {
    var dataLogin = action.data;

    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8'
      },
      mode: 'cors',
    }

    options.body = JSON.stringify(dataLogin);

    const response = yield call(request, loginUrl, options);
    showProgressLog(loginUrl, response, "loginSaga");
    if (response && response.access_token) {
      updateLocalStorage(
        {
          access_token: response.access_token
        }
      );
      yield put({ type: LOGIN_SUCCESS });
      yield put(setAuth(response.access_token));
    }
    else {
      yield put({ type: LOGIN_ERROR, error: response.error || 'Erreur' });
    }
  } catch (err) {
    yield put({ type: LOGIN_ERROR, error: { msg: err } });
    //showProgressLog(err);
  }
}

export function* fetchLoginFacebook(action) {
  // Select username from store
  try {
    //var dataLogin = action.data;

    var options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + action.access_token

      },
      mode: 'cors',
    }

    //options.body = JSON.stringify(dataLogin);

    const response = yield call(request, authWithFaceBookTokenUrl, options);
    showProgressLog(authWithFaceBookTokenUrl, response, "loginFacebookSaga");
    if (response && response.status === 200 && response.access_token) {
      updateLocalStorage(
        {
          access_token: response.access_token
        }
      );
      yield put({ type: LOGIN_SUCCESS });
      yield put(setAuth(response.access_token));
    }
    else {
      yield put({ type: LOGIN_ERROR, error: response.error || 'Erreur' });
    }
  } catch (err) {
    yield put({ type: LOGIN_ERROR, error: { msg: err } });
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
export default function* registerFlow(context) {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeEvery(LOGIN_REQUEST, fetchLogin);
  yield takeEvery(LOGIN_FACEBOOK_REQUEST, fetchLoginFacebook);
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
