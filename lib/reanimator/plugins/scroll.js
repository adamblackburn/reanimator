/* vim: set et ts=2 sts=2 sw=2: */
/*jshint evil:true */
var Reanimator = require('../core');
var _native;

Reanimator.plug('scroll', {
  init: function init(native) {
    _native = native;
    console.log('scroll init');
  },

  capture: function capture(log, config) {
    _log = log;
    $(document).scroll(function () {
      entry = {
        time: _native.Date.now(),
        type: 'scroll',
        details: {top: $(document).scrollTop()}
      };
      if (_log) {
        _log.events.push(entry)
      }
    });
  },

  replay: function (entry) {
    console.log(entry.details.top);
    $(document).scrollTop(entry.details.top);
  },

  beforeReplay: function replay(log, config) {
  },

  cleanUp: function () {
    _log = null;
    _native = null;
   // TODO: should probably remove JQuery event handler
  }
});
