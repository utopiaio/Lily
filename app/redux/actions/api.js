import request from 'superagent';
import notie from 'notie';
import { API_BASE_URL, API_AUTH_HEADER, API_QUERY_LIMIT, API_TABLES, NOTY_SUCCESS, NOTY_ERROR } from './../../config';
import { API_SET, API_POST, API_PUT, API_DELETE, PURGE_STORE } from './../constants/constants';
import { show, hide } from './../../lily/backdrop';
import store from './../store';



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
function GET(table, id, force = false, limit = API_QUERY_LIMIT) {
  return new Promise((resolve, reject) => {
    let rows = store.getState().API[table.name];
    let auth = store.getState().auth;

    // first time table initiation
    // store should should be initiated with `API_SET`
    if(rows === undefined || force === true) {
      show();

      if(id === undefined) {
        // query
        request
          .get(`${API_BASE_URL}/${table.name}`)
          .set(API_AUTH_HEADER, auth.jwt)
          .query({limit})
          .end((error, response) => {
            hide();

            if(response && response.ok === true) {
              store.dispatch({type: API_SET, table: table.name, rows: Object.assign([], response.body)});
              resolve(Object.assign([], response.body));
            } else {
              notie.alert(3, `Error fetching query`, NOTY_ERROR);
              reject(error);
            }
          });
      } else {
        // id is set, fetching entry
        request
          .get(`${API_BASE_URL}/${table.name}/${id}`)
          .set(API_AUTH_HEADER, auth.jwt)
          .end((error, response) => {
            hide();

            if(response && response.ok === true) {
              if(rows === undefined) {
                // making sure we're not clearing the store on force GET requests
                store.dispatch({type: API_SET, table: table.name, rows: Object.assign([], [Object.assign({}, response.body)])});
              } else {
                let index = -1;
                for(let i = rows.length - 1; i >= 0; i--) {
                  if(rows[i][table.id] === response.body[table.id]) {
                    index = i;
                  }
                };

                store.dispatch({type: index === -1 ? API_POST : API_PUT, table: table.name, index, row: Object.assign({}, response.body)});
              }

              resolve(Object.assign({}, response.body));
            } else {
              notie.alert(3, `Unable to fetch entery`, NOTY_ERROR);
              reject(error);
            }
          });
      }
    } else {
      // table initiated in the API store, we're going to try to return from the store
      if(id === undefined) {
        // query, return from store
        resolve(rows);
      } else {
        // GET, look for it in the store & if not found, fetch it from server
        let found = false;
        for(let i = rows.length - 1; i >= 0; i--) {
          if(rows[i][table.id] === id) {
            resolve(Object.assign({}, rows[i]));
            found = true;
            break;
          }
        };

        if(found === false) {
          show();

          // fetching from server...
          request
            .get(`${API_BASE_URL}/${table.name}/${id}`)
            .set(API_AUTH_HEADER, auth.jwt)
            .end((error, response) => {
              hide();

              if(response && response.ok === true) {
                // adding the *newly* fetched item into the store...
                store.dispatch({type: API_POST, table: table.name, row: Object.assign({}, response.body)});
                resolve(Object.assign({}, response.body));
              } else {
                notie.alert(3, `Unable to fetch entery`, NOTY_ERROR);
                reject(error);
              }
            });
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
 * @param {Object} data - new data to be inserted
 * @return {Promise}
 */
function POST(table, data) {
  return new Promise((resolve, reject) => {
    let auth = store.getState().auth;
    let rows = store.getState().API[table.name];
    show();

    request
      .post(`${API_BASE_URL}/${table.name}`)
      .set(API_AUTH_HEADER, auth.jwt)
      .send(data)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          notie.alert(1, `Entery successfully saved to '${table.name}'`, NOTY_SUCCESS);

          if(rows === undefined) {
            store.dispatch({type: API_SET, table: table.name, rows: Object.assign([], [Object.assign({}, response.body)])});
          } else {
            store.dispatch({type: API_POST, table: table.name, row: Object.assign({}, response.body)});
          }

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
 * PUT
 *
 * @param {Object} table
 * @param {String} table.id - table key used to identify an entry
 * @param {String} table.name - table name that's mapped to the API
 * @param {String} data - updated info of an entry
 * @return {Promise}
 */
function PUT(table, data) {
  return new Promise((resolve, reject) => {
    let auth = store.getState().auth;
    let rows = store.getState().API[table.name];
    show();

    request
      .put(`${API_BASE_URL}/${table.name}/${data[table.id]}`)
      .set(API_AUTH_HEADER, auth.jwt)
      .send(data)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          notie.alert(1, `Entery successfully updated to '${table.name}'`, NOTY_SUCCESS);

          if(rows === undefined) {
            store.dispatch({type: API_SET, table: table.name, rows: Object.assign([], [Object.assign({}, response.body)])});
          } else {
            let index = -1;
            for(let i = rows.length - 1; i >= 0; i--) {
              if(rows[i][table.id] === data[table.id]) {
                index = i;
                break;
              }
            };

            store.dispatch({type: index === -1 ? API_POST : API_PUT, table: table.name, index, row: Object.assign({}, response.body)});
          }

          resolve(Object.assign({}, response.body));
        } else {
          if(response && response.body && response.body.error) {
            notie.alert(3, response.body.error, NOTY_ERROR);
            reject(response.body.error);
          } else {
            notie.alert(3, `Error updating entery`, NOTY_ERROR);
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
 * @param {Object} data - entry to be deleted
 * @return {Promise}
 */
function DELETE(table, data) {
  return new Promise((resolve, reject) => {
    let auth = store.getState().auth;
    let rows = store.getState().API[table.name];
    show();

    request
      .del(`${API_BASE_URL}/${table.name}/${data[table.id]}`)
      .set(API_AUTH_HEADER, auth.jwt)
      .end((error, response) => {
        hide();

        if(response && response.ok === true) {
          notie.alert(1, `Entery successfully deleted from '${table.name}'`, NOTY_SUCCESS);

          if(rows === undefined) {
            // store isn't affected by the entry delete
          } else {
            let index = -1;
            for(let i = rows.length - 1; i >= 0; i--) {
              if(rows[i][table.id] === data[table.id]) {
                index = i;
                break;
              }
            };

            if(index > -1) {
              // entry exists on the store, removing...
              store.dispatch({type: API_DELETE, table: table.name, index});
            }
          }

          resolve(Object.assign({}, response.body));
        } else {
          if(response && response.body && response.body.error) {
            notie.alert(3, response.body.error, NOTY_ERROR);
            reject(response.body.error);
          } else {
            notie.alert(3, `Error updating entery`, NOTY_ERROR);
            reject(error);
          }
        }
      });
  });
}



/**
 * Clears the API store
 * no API call is made, it simply *clears* the redux store
 *
 * @return {Promise}
 */
function PURGE() {
  return new Promise((resolve, reject) => {
    store.dispatch({type: PURGE_STORE});
    resolve();
  });
}



exports.GET = GET;
exports.POST = POST;
exports.PUT = PUT;
exports.DELETE = DELETE;
exports.PURGE = PURGE;
