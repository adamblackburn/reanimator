/* vim: set et ts=2 sts=2 sw=2: */
/*jshint evil:true */
var Reanimator = require('../core');
var _native;

Reanimator.plug('hashchange', {
  init: function init(native) {
    _native = native;
    console.log('hashchange init');
  },

  capture: function capture(log, config) {
    _log = log;

    $(window).on("hashchange", function () {
      entry = {
        time: _native.Date.now(),
        type: 'hashchange',
        details: {newhash: window.location.hash}
      };
      if (_log) {
        _log.events.push(entry)
      }
    });
  },

  replay: function (entry) {
    console.log('setting hash: ' + entry.details.newhash);
    window.location.hash = entry.details.newhash;
  },

  beforeReplay: function replay(log, config) {
  },

  cleanUp: function () {
    _log = null;
    _native = null;
  }
});
