/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  SET_AUTH,
  LOGOUT_REQUEST,
  VOTE_PHOTO_REQUEST,
  SHOW_NOTIFICATION,
} from './constants';


/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function setAuth(access_token) {
  return {
    type: SET_AUTH,
    access_token,
  };
}

export function logoutRequest(access_token) {
  return {
    type: LOGOUT_REQUEST,
    access_token
  }
};

export function showNotif (message)
{
  return {type: SHOW_NOTIFICATION, message: message};  
}

export function votePhotoRequest(photoId)
{
  return {type: VOTE_PHOTO_REQUEST, photoId: photoId };
}