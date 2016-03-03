import request from 'superagent';
import notie from 'notie';
import moment from 'moment';
import { API_BASE_URL, API_AUTH_HEADER, API_QUERY_LIMIT, API_TABLES, NOTY_SUCCESS, NOTY_ERROR } from './../../config';
import { API_SET, API_POST, API_PATCH, API_DELETE } from './../constants/constants';
import { show, hide } from './../../lily/backdrop';
import { store } from './../store';
// object to be used for making sure a cache doesn't abuse its welcome
// structure:
// {[API_TABLES.TABLE.name]: moment()}
let lastReqested = {};



/**
 * a utility function that turns an array of entries into an object
 * of structure:
 * {[id]: entry}
 *
 * @param {Object} table
 * @param {Array} entries
 * @return {Object}
 */
function buildEntryObject (table, entries = []) {
  let entriesBuild = {};

  entries.forEach((entry) => {
    entriesBuild[entry[table.id]] = entry;
  });

  return entriesBuild;
}



/**
 * even if this does NOT affect the store, it's added here for ONLY convince purpose
 *
 * @param {Object} table
 * @param {String} q - query search string
 * @param {Number} limit - limit on query return
 */
function SEARCH(table, q, limit = API_QUERY_LIMIT) {
  return new Promise((resolve, reject) => {
    show();

    request
      .get(`${API_BASE_URL}/${table.name}`)
      .set(API_AUTH_HEADER, store.getState().auth.jwt)
      .query({limit, q})
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          resolve(Object.assign({}, buildEntryObject(table, response.body)));
        } else {
          notie.alert(3, response.body.error, NOTY_ERROR);
          reject(error);
        }
      });
  });
}



/**
 * GET
 *
 * @param {Object} table - table in question
 * @param {String} table.name - table name
 * @param {String} table.id - table id for identifying an entry
 * @param {Boolean} force - whether or not to bypass the cache and request the server
 * @param {Number} id - id (serial) used to fetch from store / server
 * @return {Promise}
 */
function GET(table, id = -1, force = false, limit = API_QUERY_LIMIT) {
  return new Promise((resolve, reject) => {
    let entries = store.getState().API[table.name];
    let auth = store.getState().auth;
    let clone = lastReqested[table.name].clone(); // otherwise we'll be mutating lastReqested itself
    const age = table.age.match(/[0-9]+|[a-z]+/gi);

    // first time table initiation
    // store should should be initiated with `API_SET`
    if(force === true || clone.add(Number(age[0]), age[1]).isAfter(moment()) === false) {
      show();

      if(id === -1) {
        // query
        lastReqested[table.name] = moment();
        request
          .get(`${API_BASE_URL}/${table.name}`)
          .set(API_AUTH_HEADER, auth.jwt)
          .query({limit})
          .end((error, response) => {
            hide();

            if(response && response.ok === true) {
              let built = buildEntryObject(table, response.body);
              store.dispatch({type: API_SET, table, entries: Object.assign({}, built)});
              resolve(Object.assign({}, built));
            } else {
              notie.alert(3, response.body.error, NOTY_ERROR);
              reject(error);
            }
          });
      } else {
        // id is set, fetching entry...
        request
          .get(`${API_BASE_URL}/${table.name}/${id}`)
          .set(API_AUTH_HEADER, auth.jwt)
          .end((error, response) => {
            hide();

            if(response && response.ok === true) {
              store.dispatch({type: API_POST, table, entry: Object.assign({}, response.body)});
              resolve(Object.assign({}, response.body));
            } else {
              notie.alert(3, response.body.error, NOTY_ERROR);
              reject(error);
            }
          });
      }
    } else {
      // table initiated in the API store, we're going to try to return from the store
      if(id === -1) {
        // query, return from store...
        resolve(entries);
      } else {
        if(entries.hasOwnProperty(id) === false) {
          show();

          // fetching from server...
          request
            .get(`${API_BASE_URL}/${table.name}/${id}`)
            .set(API_AUTH_HEADER, auth.jwt)
            .end((error, response) => {
              hide();

              if(response && response.ok === true) {
                // adding the *newly* fetched item into the store...
                store.dispatch({type: API_POST, table, entry: Object.assign({}, response.body)});
                resolve(Object.assign({}, response.body));
              } else {
                notie.alert(3, response.body.error, NOTY_ERROR);
                reject(error);
              }
            });
        } else {
          // we have it in our entry list
          resolve(Object.assign({}, entries[id]));
        }
      }
    }
  });
}



/**
 * POST
 *
 * @param {Object} table - table name data is to be inserted into
 * @param {String} table.id - table key used to identify an entry
 * @param {String} table.name - table name that's mapped to the API
 * @param {Object} entry - new entry to be inserted
 * @return {Promise}
 */
function POST(table, entry) {
  return new Promise((resolve, reject) => {
    show();

    request
      .post(`${API_BASE_URL}/${table.name}`)
      .set(API_AUTH_HEADER, store.getState().auth.jwt)
      .send(entry)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          notie.alert(1, `Entry successfully saved to '${table.human}'`, NOTY_SUCCESS);
          store.dispatch({type: API_POST, table, entry: Object.assign({}, response.body)});
          resolve(Object.assign({}, response.body));
        } else {
          if(response && response.body && response.body.error) {
            notie.alert(3, response.body.error, NOTY_ERROR);
            reject(response.body.error);
          } else {
            notie.alert(3, `Error saving entery`, NOTY_ERROR);
            reject(error);
          }
        }
      });
  });
}



/**
 * PATCH
 *
 * @param {Object} table
 * @param {String} table.id - table key used to identify an entry
 * @param {String} table.name - table name that's mapped to the API
 * @param {Object} entry - updated info of an entry
 * @return {Promise}
 */
function PATCH(table, entry) {
  return new Promise((resolve, reject) => {
    show();

    request
      .patch(`${API_BASE_URL}/${table.name}/${entry[table.id]}`)
      .set(API_AUTH_HEADER, store.getState().auth.jwt)
      .send(entry)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          notie.alert(1, `Entry successfully updated to '${table.human}'`, NOTY_SUCCESS);
          store.dispatch({type: API_PATCH, table, entry: Object.assign({}, response.body)});
          resolve(Object.assign({}, response.body));
        } else {
          if(response && response.body && response.body.error) {
            notie.alert(3, response.body.error, NOTY_ERROR);
            reject(response.body.error);
          } else {
            notie.alert(3, `Error updating entry`, NOTY_ERROR);
            reject(error);
          }
        }
      });
  });
}



/**
 * DELETE
 *
 * @param {Object} table
 * @param {String} table.id - table key used to identify an entry
 * @param {String} table.name - table name that's mapped to the API
 * @param {Object} entry - entry to be deleted
 * @return {Promise}
 */
function DELETE(table, entry) {
  return new Promise((resolve, reject) => {
    show();

    request
      .del(`${API_BASE_URL}/${table.name}/${entry[table.id]}`)
      .set(API_AUTH_HEADER, store.getState().auth.jwt)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          notie.alert(1, `Entry successfully deleted from '${table.human}'`, NOTY_SUCCESS);
          store.dispatch({type: API_DELETE, table, entry: response.body});
          resolve(Object.assign({}, response.body));
        } else {
          if(response && response.body && response.body.error) {
            notie.alert(3, response.body.error, NOTY_ERROR);
            reject(response.body.error);
          } else {
            notie.alert(3, `Error deleting entry`, NOTY_ERROR);
            reject(error);
          }
        }
      });
  });
}



/**
 * initiates
 * > store with an empty object for each table
 *
 * @return {Promise}
 */
function init() {
  return new Promise((resolve) => {
    for(let TABLE in API_TABLES) {
      lastReqested[API_TABLES[TABLE].name] = moment().subtract(7, 'days');
      store.dispatch({type: API_SET, table: API_TABLES[TABLE], entries: {}});
    }

    resolve();
  });
}



export {
  GET,
  POST,
  PATCH,
  DELETE,
  SEARCH,
  init
};
