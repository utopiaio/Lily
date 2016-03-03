/**
 * @module {show, hide}
 * simply shows n' hides backdrop with a spinner in the middle
 *
 * usage:
 * show() - to show the backdrop
 * hide() - to hide the backdrop
 */

import Spinner from 'spin.js';

let _timeout = 10000;
let _spinner = null;
let _timeoutHandler = null;
let _options = {
  lines: 48,
  length: 8,
  width: 2,
  radius: 32,
  scale: 1,
  corners: 1,
  color: '#2c3e50',
  opacity: 0.25,
  rotate: 0,
  direction: 1,
  speed: 1,
  trail: 75,
  fps: 24,
  zIndex: 2e9,
  className: 'spinner',
  top: '50%',
  left: '50%',
  shadow: false,
  hwaccel: true,
  position: 'fixed'
};

// backdrop element
let _backdrop = document.createElement('div');
_backdrop.setAttribute('style', `position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 9999;background-color: rgba(255, 255, 255, 0.5);`);

let hide = () => {
  if(_timeoutHandler !== null && _spinner !== null) {
    _spinner.stop();
    _spinner = null;
    clearTimeout(_timeoutHandler);
    _timeoutHandler = null;
    document.body.removeChild(_backdrop);
    document.body.style.overflowY = 'scroll';
  }
};

let show = () => {
  hide();
  document.body.appendChild(_backdrop);
  document.body.style.overflowY = 'hidden';
  _spinner = new Spinner(_options).spin(document.querySelector('body'));
  _timeoutHandler = setTimeout(() => {
    if(_spinner !== null) {
      _spinner.stop();
      _spinner = null;
      document.body.removeChild(_backdrop);
      document.body.style.overflowY = 'scroll';
    }
  }, _timeout);
};

exports.show = show;
exports.hide = hide;
