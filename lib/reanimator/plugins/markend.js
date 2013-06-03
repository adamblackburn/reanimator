/* vim: set et ts=2 sts=2 sw=2: */
/*jshint evil:true */
var Reanimator = require('../core');
var _log, _native;

Reanimator.plug('finished', {
  init: function init(native) {
    _native = native;
  },

  capture: function capture(log, config) {
    _log = log;
  },

  replay: function (entry) {
      console.log('replay finished');
      $(document).trigger('reanimator-finished');
  },

  beforeReplay: function replay(log, config) {
  },

  cleanUp: function () {
    if (_log) {
      entry = {
        time: _native.Date.now(),
        type: 'finished',
        details: {}
      };
      _log.events.push(entry);
    }
  }
});
