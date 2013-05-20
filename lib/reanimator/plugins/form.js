/* vim: set et ts=2 sts=2 sw=2: */
/*jshint evil:true */
var Reanimator = require('../core');
var _native;

Reanimator.plug('form', {
  init: function init(native) {
    _native = native;
    console.log('form init');
  },

  capture: function capture(log, config) {
    _log = log;
    $("body").on("change", "input,textarea", function () {

      // start at the node that triggered the event
      var n = $(this);

      // construct a tree "address" for the node n
      // as a way to reference it later
      var domaddr = new Array();
      while (n.index() != -1) {
	domaddr.push(n.index());
	n = n.parent();
      }

      // store the address and updated value in the tree
      entry = {
        time: _native.Date.now(),
        type: 'form',
        details: {val: $(this).val(), domaddr: domaddr}
      };

      // log the event
      if (_log) {
        _log.events.push(entry)
      }
    });
  },

  replay: function (entry) {
    // load the dom address of the node
    var domaddr = entry.details.domaddr;

    // start at the top
    var el = $(document);

    // walk through the address
    while (domaddr.length > 0) {
      // popping index values and moving into the node
      el = el.children();
      el = $(el.get(domaddr.pop()));
    }

    // found it; set the value
    $(el).val(entry.details.val);
  },

  beforeReplay: function replay(log, config) {
  },

  cleanUp: function () {
    _log = null;
    _native = null;
   // TODO: should probably remove JQuery event handler
  }
});
