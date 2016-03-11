/**
 * @description configuration values for The Condor
 * what's the difference between bravery and courage?
 * ...bravery is something that you do
 */

// path / name
const DEFAULT_NON_AUTH_PATH_NAME = 'landing'; // default path (router-view) for a non-auth page
const DEFAULT_AUTH_PATH_NAME = 'one'; // default path/name (router-view) for a auth-ed page
const LOGIN_PATH_NAME = 'login'; // path name for login

// Noty notification timeout (in seconds)
const NOTY_SUCCESS = 1.5;
const NOTY_INFO = 1.5;
const NOTY_WARN = 3;
const NOTY_ERROR = 3;

// API
const API_AUTH_URL = 'http://rock.io/auth'; // authentication url
const S3_URL = 'http://rock.io/S3'; // url for file uploading
const API_BASE_URL = 'http://rock.io'; // base url for API calls <METHOD> <API_BASE_URL>/<tableName>[/<tableId>]
const API_AUTH_HEADER = 'X-Access-Token'; // header so send the JWT
const AUTH_STORE_KEY = 'auth'; // key used to store (localforage) the auth info
const API_QUERY_LIMIT = 100; // default limit for number of results to return
const API_TABLES = Object.freeze({
  ROCK: {name: 'rock', human: 'Rock', id: 'id', age: '30 minutes'},
  TAG: {name: 'tag', human: 'Tag', id: 'id', age: '30 minutes'},
  S3: {name: 's3', human: 'S3', id: 'id', age: '30 minutes'},
  USER: {name: 'user', human: 'User', id: 'user_id', age: '30 minutes'},
  USER_GROUP: {name: 'user_group', human: 'User Group', age: '30 minutes'}
});

/**
 * I've learned an import lesson on ECMASCript from module = {exports: {}}
 * so whenever possible I'll be using CommonJs format instead of the default
 * ECMA2015 format
 *
 * PS
 * Babel 6 *fixes* the confusion with `default` export so watch out
 */
export {
  DEFAULT_NON_AUTH_PATH_NAME,
  DEFAULT_AUTH_PATH_NAME,
  LOGIN_PATH_NAME,
  API_AUTH_URL,
  S3_URL,
  API_BASE_URL,
  API_AUTH_HEADER,
  AUTH_STORE_KEY,
  API_QUERY_LIMIT,
  API_TABLES,
  NOTY_SUCCESS,
  NOTY_INFO,
  NOTY_WARN,
  NOTY_ERROR
};
