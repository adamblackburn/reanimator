$('document').ready(function() {
  function init() {
    var squareCount = 1000;
    for (var i = 0;i<squareCount;i++) {
        var d = $('<div/>');
        d.addClass('square');
        d.css('background-color', "" + Math.floor(Math.random() * 0xfffff))
        $('#squares').append(d);
    }
    
  $('.square').click(function (i, e) {
        $(this).css('background-color', "" + Math.floor(Math.random() * 0xfffff))
  });

  };

  if (location.search.slice(1) === 'replay') {
    $(window).on('message', function (e) {
      var log = JSON.parse(e.originalEvent.data);
      Reanimator.replay(log, {
        delay: 'realtime'
      });
      console.log("replaying");
      console.log(log);
      init();
    });
    console.log("replay");
  } else {
    setTimeout(function () {
      Reanimator.capture();
      console.log("capturing");
      init();
    }, 0);
    console.log("capture");
  }
});

