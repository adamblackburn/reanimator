// our custom JQuery library will send a ready-but-waiting when ready should
// have fired, but holdReady is set. This allows us to run our code before
// any other JQuery ready calls.
$.holdReady(true);

// wait for the document to be ready, but while holding
$(document).on('ready-but-waiting', function() {
  console.log('Reanimator received ready-but-waiting signal... loading...');

  // if this is a replay
  if (location.search.slice(1) === 'replay') {
    // load the log from localStorage
    // should have been placed there by the pre script
    var log = JSON.parse(localStorage.getItem('__reanimator_log__'));

    console.log('Loaded replay log from local storage.');
    console.log(log);

    // start the replay
    Reanimator.replay(log, {
      delay: 'realtime'
    });

    // disable holdReady
    // this will cause the normal JQuery ready events to fire
    $.holdReady(false);

    // allow the parent to display a message when reanimator is done
    $(document).on('reanimator-finished', function() {
      parent.postMessage('reanimator-finished', '*');
    });

    // allow the parent to tell reanimator to leave the localStorage
    // in place or to trigger cleanup
    $(window).on('message', function (e) {
      console.log("Received control message.");

      var message = e.originalEvent.data;
      if (message === 'cleanup') {
        Reanimator.cleanUp();
      } else if (message === 'keep-state') {
        localStorage.removeItem('__reanimator_presnap__');
      }
    });

    // on unload, reset localStorage and other cleanup actions
    $(window).on('unload', function () {
      Reanimator.cleanUp();
      window.xmlHttpRequest = window.oldXmlHttpRequest;
      console.log("Replay ending! Reanimator cleaned up.");
    });
  } else {
    // the disableCapture variable can be used to disable capture for any
    // reason if it is declared globally
    if (typeof disableCapture === 'undefined' || disableCapture === 0) {
      // get URL information at load time
      // this prevents trouble if we have hashchanges
      var url = document.URL;
      var origin = window.location.origin;
      var pathname = window.location.pathname;

      console.log("Initializing capture...");

      // start the capture immediately after this finishes running
      setTimeout(function () {
        Reanimator.capture();
        console.log("Capture started.");
        $.holdReady(false);
      }, 0);

      // when unloading, grab some more data and post the replay log to
      // replay-viewer for easy watching
      $(window).on('unload', function () {
        Reanimator.cleanUp();
        window.xmlHttpRequest = window.oldXmlHttpRequest;
        console.log("Page unloading. Capture ended. Posting replay to server...");

        // collect data to allow an accurate replay and some debugging
        // information about the browser
        var metadata = { height : $(window).height(),
                         width : $(window).width(),
                         useragent : navigator.userAgent,
                         url : url,
                         origin : origin,
                         pathname : pathname };

        // collect the data in one spot to upload
        var postObject = { replay_log : JSON.stringify(Reanimator.flush()),
                            metadata : JSON.stringify(metadata),
                            // change this app id for your application
                            app_id : '5nsn7u8' };

        // do the upload when the page unloads
        // must be synchronous
        // can change this URL to something else
        $.ajax("http://replay-viewer.appspot.com/replay/upload",
            { data : postObject,
              type : 'POST',
              async : false }
          ).success(function() {
            console.log('Replay posted succesfully.');
          }).always(function() {
            console.log("Replay XHR finished.");
          });
      });
    }
  }
});
