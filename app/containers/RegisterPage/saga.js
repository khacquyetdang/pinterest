/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put } from 'redux-saga/effects';
import { REGISTER_REQUEST, REGISTER_ERROR, REGISTER_SUCCESS, REGISTER_FCB_REQUEST } from './constants';
import request from 'utils/request';
import { showProgressLog } from 'utils/logger';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth';
import { push } from 'react-router-redux';
import { registerUrl, authWithFaceBookTokenUrl } from 'config';
import { setAuth } from './../App/actions';

export function* fetchRegister(action) {
  // Select username from store
  try {
    var dataRegister = action.data;

    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'content-type' : 'application/json; charset=utf-8'
      },
      mode: 'cors',
    }

    options.body = JSON.stringify(dataRegister);

    const response = yield call(request, registerUrl, options);
    showProgressLog(registerUrl, response, "registerSaga");
    if (response && response.error) {
      yield put({ type: REGISTER_ERROR, error: response.error || 'Erreur' });
    }
    else {
      yield put({ type: REGISTER_SUCCESS });
    }
  } catch (err) {
    yield put({ type: REGISTER_ERROR, error: { msg : err }});
    //showProgressLog(err);
  }
}

export function* fetchRegisterFacebook(action) {
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
      yield put({ type: REGISTER_SUCCESS });
      //yield put(showNotif(formatMessage(messages.connexion_ok)));
      yield put(setAuth(response.access_token));
    }
    else {
      yield put({ type: REGISTER_ERROR, error: response.error || 'Erreur' });
    }
  } catch (err) {
    yield put({ type: REGISTER_ERROR, error: { msg: err } });
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
  yield takeEvery(REGISTER_REQUEST, fetchRegister);
  yield takeEvery(REGISTER_FCB_REQUEST, fetchRegisterFacebook);
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
