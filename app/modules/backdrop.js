;(function() {
  'use strict';

  var Spinner = require('spin.js');
  var _timeout = 10000;
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
  _backdrop.setAttribute('class', '__backdrop__');

  var _hide = function() {
    if(_timeoutHandler !== null && _spinner !== null) {
      _spinner.stop();
      _spinner = null;
      clearTimeout(_timeoutHandler);
      _timeoutHandler = null;
      if(document.getElementsByClassName('__backdrop__').length > 0) {
        document.body.removeChild(_backdrop);
        document.body.style.overflowY = 'scroll';
      }
    }
  };

  var _show = function() {
    _hide();
    document.body.appendChild(_backdrop);
    document.body.style.overflowY = 'hidden';
    _spinner = new Spinner(_options).spin(document.querySelector('body'));
    _timeoutHandler = setTimeout(function() {
      if(_spinner !== null) {
        _spinner.stop();
        _spinner = null;
        document.body.removeChild(_backdrop);
        document.body.style.overflowY = 'scroll';
      };
    }, _timeout);
  };

  if(typeof module !== 'undefined' && module) {
    module.exports = {show: _show, hide: _hide};
  }
})();
