/* vim: set et ts=2 sts=2 sw=2: */
var Reanimator = require('../core');

var _native, _log;
var _capture = true;

/**
 * Capture all keys in localStorage in index order
 */
function snapshot() {
  var len = localStorage.length;
  var state = new Array(len);

  for (var i = 0, k; i < len; i++) {
    k = localStorage.key(i);
    state[i] = {
      key: k,
      value: localStorage[k]
    };
  }

  return state;
}

/**
 * Set localStorage to state captured in a snapshot
 */
function restore(snapshot) {
  localStorage.clear();
  for (var i = 0, len = snapshot.length; i < len; i++) {
    localStorage[snapshot[i].key] = snapshot[i].value;
  }
}

Reanimator.plug('local-storage', {
  init: function init(native) {
    _native = native;
    _native.localStorage_getItem = window.localStorage.getItem;
    _native.localStorage_setItem = window.localStorage.setItem;
    _native.localStorage_clear = window.localStorage.clear;
  },
  capture: function xhr_capture(log, config) {
    _log = log;
    _capture = true;


    _log.localStorage = {
        state: snapshot()
    };
  },
  pre: function(log) {
      console.log("localStorage pre called");
      var snap = JSON.stringify(snapshot());
      restore(log.localStorage.state);
      localStorage.setItem('__reanimator_presnap__', snap);
  },
  beforeReplay: function (log, config) {
    var k;
    _capture = false;

    _log = log;

    _log.localStorage = _log.localStorage || {};

    _log.localStorage.preReplayState = snapshot();

    _log.localStorage.state = _log.localStorage.state || [];
  },
  cleanUp: function localStorage_cleanUp() {
    var presnap = localStorage.getItem('__reanimator_presnap__');
    if (presnap)
        restore(JSON.parse(presnap));

    window.localStorage.getItem = _native.localStorage_getItem;
    window.localStorage.setItem = _native.localStorage_setItem;
    window.localStorage.clear = _native.localStorage_clear;
  }
});
