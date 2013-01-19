/* vim: set et ts=2 sts=2 sw=2: */

var expect = require('expect.js');
var asyncTrialRunner = require('../../util/async-trial-runner');
var _ = require('lodash');

describe('Reanimator replays captured timer interrupts', function () {
  var build = require('../../util/hooks').build;
  var url = 'http://localhost:' + process.env.FIXTURE_PORT + '/index.html';
  var driver;

  beforeEach(function (done) {
    build().then(function (builtDriver) {
      driver = builtDriver;
      done();
    });
  });

  afterEach(function () {
    driver.quit();
  });

  it('setTimeout', function (done) {
    var events = [{
        type: 'setTimeout',
        id: 0,
        time: 123
      }, {
        type: 'setTimeout',
        id: 2,
        time: 123
      }, {
        type: 'setTimeout',
        id: 1,
        time: 123
      }];

    driver.get(url).
      then(function () {
        return driver.executeAsyncScript(function (events, callback) {
          var result = [];
          Reanimator.replay({
            dates: [],
            events: events
          });

          setTimeout(function () {
            result.push(0);
          }, 0);
          setTimeout(function () {
            result.push(1);
            Reanimator.cleanUp();

            callback(result);
          }, 100);
          setTimeout(function () {
            result.push(2);
          }, 50);
        }, events);
      }).
      then(function (result) {
        expect(result).to.eql(_.pluck(events, 'id'));
        done();
      });
  });
});