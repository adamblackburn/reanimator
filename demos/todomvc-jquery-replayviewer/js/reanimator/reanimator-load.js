$.holdReady(true);

$(document).on('ready-but-waiting', function() {
  console.log('Reanimator received ready-but-waiting signal... loading...');

  if (location.search.slice(1) === 'replay') {
    var log = JSON.parse(localStorage.getItem('__reanimator_log__'));

    console.log('Loaded replay log from local storage.');
    console.log(log);

    Reanimator.replay(log, {
      delay: 'realtime'
    });

    $.holdReady(false);

    $(document).on('reanimator-finished', function() {
      parent.postMessage('reanimator-finished', '*');
    });

    $(window).on('message', function (e) {
      console.log("Received control message.");

      var message = e.originalEvent.data;
      if (message === 'cleanup') {
        Reanimator.cleanUp();
      } else if (message === 'keep-state') {
        localStorage.removeItem('__reanimator_presnap__');
      }
    });

    $(window).on('unload', function () {
      Reanimator.cleanUp();
      window.xmlHttpRequest = window.oldXmlHttpRequest;
      console.log("Replay ending! Reanimator cleaned up.");
    });
  } else {
    if (typeof disableCapture === 'undefined' || disableCapture === 0) {
      var url = document.URL; // get the URL at page load time
      var origin = window.location.origin;
      var pathname = window.location.pathname;

      console.log("Initializing capture...");

      setTimeout(function () {
        Reanimator.capture();
        console.log("Capture started.");
        $.holdReady(false);
      }, 0);

      $(window).on('unload', function () {
        Reanimator.cleanUp();
        window.xmlHttpRequest = window.oldXmlHttpRequest;
        console.log("Page unloading. Capture ended. Posting replay to server...");

        var metadata = { height : $(window).height(),
                         width : $(window).width(),
                         useragent : navigator.userAgent,
                         url : url,
                         origin : origin,
                         pathname : pathname };

        var postObject = { replay_log : JSON.stringify(Reanimator.flush()),
                            metadata : JSON.stringify(metadata),
                            app_id : '5nsn7u8' };

        $.ajax("http://replay-viewer.appspot.com/replay/upload",
        //  $.ajax("http://localhost:15000/replay/upload",
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
