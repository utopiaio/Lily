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
  ABOUT: {name: 'about', human: 'About', id: 'id', age: '30 minutes'},
  S3: {name: 's3', human: 'S3', id: 'id', age: '30 minutes'},
  SOCIAL: {name: 'social', human: 'Social', id: 'id', age: '30 minutes'},
  STORY: {name: 'story', human: 'Story', id: 'id', age: '30 minutes'},
  TAGS: {name: 'tags', human: 'Tags', id: 'id', age: '30 minutes'},
  USERS: {name: 'users', human: 'Users', id: 'user_id', age: '30 minutes'}
});

/**
 * I've learned an import lesson on ECMASCript from module = {exports: {}}
 * so whenever possible I'll be using CommonJs format instead of the default
 * ECMA2015 format
 *
 * PS
 * Babel 6 *fixes* the confusion with `default` export so watch out
 */
exports.DEFAULT_NON_AUTH_PATH_NAME = DEFAULT_NON_AUTH_PATH_NAME;
exports.DEFAULT_AUTH_PATH_NAME = DEFAULT_AUTH_PATH_NAME;
exports.LOGIN_PATH_NAME = LOGIN_PATH_NAME;
exports.API_AUTH_URL = API_AUTH_URL;
exports.S3_URL = S3_URL;
exports.API_BASE_URL = API_BASE_URL;
exports.API_AUTH_HEADER = API_AUTH_HEADER;
exports.AUTH_STORE_KEY = AUTH_STORE_KEY;
exports.API_QUERY_LIMIT = API_QUERY_LIMIT;
exports.API_TABLES = API_TABLES;
exports.NOTY_SUCCESS = NOTY_SUCCESS;
exports.NOTY_INFO = NOTY_INFO;
exports.NOTY_WARN = NOTY_WARN;
exports.NOTY_ERROR = NOTY_ERROR;
