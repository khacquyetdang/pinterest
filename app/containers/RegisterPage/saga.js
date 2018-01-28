/**
 * Gets the repositories of the user from Github
 */
import { call, takeEvery, takeLatest, take, put } from 'redux-saga/effects';
import { REGISTER_REQUEST, REGISTER_ERROR, REGISTER_SUCCESS } from './constants';
import request from 'utils/request';
import { showProgressLog } from 'utils/logger';
import { loadLocalStorage, updateLocalStorage } from 'localStorage';
//import auth from 'utils/auth';
import { push } from 'react-router-redux';
import { registerUrl } from 'config';

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
  yield takeEvery('GO_TO_PAGE', goToPage, context);
}
