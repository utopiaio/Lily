'use strict';

var _spin = require('spin.js');

var _spin2 = _interopRequireDefault(_spin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _timeout = 10000; /**
                       * @module {show, hide}
                       * simply shows n' hides backdrop with a spinner in the middle
                       *
                       * usage:
                       * show() - to show the backdrop
                       * hide() - to hide the backdrop
                       */

var _spinner = null;
var _timeoutHandler = null;
var _options = {
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
var _backdrop = document.createElement('div');
_backdrop.setAttribute('style', 'position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 9999;background-color: rgba(255, 255, 255, 0.5);');

var hide = function hide() {
  if (_timeoutHandler !== null && _spinner !== null) {
    _spinner.stop();
    _spinner = null;
    clearTimeout(_timeoutHandler);
    _timeoutHandler = null;
    document.body.removeChild(_backdrop);
    document.body.style.overflowY = 'scroll';
  }
};

var show = function show() {
  hide();
  document.body.appendChild(_backdrop);
  document.body.style.overflowY = 'hidden';
  _spinner = new _spin2.default(_options).spin(document.querySelector('body'));
  _timeoutHandler = setTimeout(function () {
    if (_spinner !== null) {
      _spinner.stop();
      _spinner = null;
      document.body.removeChild(_backdrop);
      document.body.style.overflowY = 'scroll';
    };
  }, _timeout);
};

exports.show = show;
exports.hide = hide;