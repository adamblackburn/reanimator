Reanimator
==========

**Capture and replay JavaScript applications**

Reanimator captures non-deterministic input to a JavaScript application in a log
that can replayed at a later date. It was originally designed for recording web
application crashes in the wild for later debugging, but it may be useful for
other purposes, such as usability testing and tutorials.

Reanimator consists of a core, which is responsible for capture setup and
driving the replay, and one or more [plugins](#reanimatorplug), which are
responsible for capturing and replaying non-deterministic input.

Reanimator ships with plugins for capturing and replaying random numbers, dates,
and timer interrupts. In addition, Reanimator provides plugins for capturing and
replaying callback invocations in the following frameworks:

- jQuery 1.8.3

Reanimator was inspired by
[Mugshot](http://research.microsoft.com/apps/pubs/default.aspx?id=120937) by
[James Mickens](http://research.microsoft.com/en-us/people/mickens/), [Jeremy
Elson](http://research.microsoft.com/en-us/people/jelson/), and [Jon
Howell](http://research.microsoft.com/en-us/people/howell/).
 
## Demos

[Tile game](http://waterfallengineering.github.com/reanimator/tile-game/index.html)
There is a functional block demo included in the demos/ directory.

# Development
## Building

You can build Reanimator with the following instructions in the
source directory.

    npm install
    make

The built files will be placed in the dist/ directory. The demos will use
the files in dist/ when run.

## Plugins

### Existing plugins

#### date.js

The date plugin captures all calls to get the current system time and
records them for replay. The plugin overwrite the Date object to ensure
that all calls are recorded. During replay, the Date object is replaced
with one that returns the recorded values.

#### document-create-event.js

This plugin replaces document.createEvent with a function that sets
some reanimator-specific properties to ensure correct recording.

#### dom-content-loaded.js

Replay the DOMContentLoaded event at the appropriate time. The plugin
saves the details from the recording, but waits until the DOM is loaded
to replay the event.

#### dom.js

Record DOM events through JQuery and replay them at the appropriate
time.

#### form.js

Record form change events and replay them, including inserting the data
into text boxes and textareas on replay.

#### hashchange.js

Record and replay hashchange events in order to faciliate proper
navigation during replay.

#### interrupts.js

Handles recording and replay of time-related functions, including
setTimeout and setInterval.

#### local-storage.js

Resets the state of localStorage during load and reverts it on page
unload to ensure that the replay has accurate localStorage. Requires
a splash page to push the previous localStorage into localStorage
before the replay page is loaded.

#### markend.js

Marks the end of the replay in the log. Will trigger a
reanimator-finished event on the document object when the replay is
completed. Listeners for this event can cause actions to occur after
the replay is complete.

#### random.js

Records and replays all calls to the Math.random function to ensure
that the replay is accurate.

#### scroll.js

Records scroll events and replays them during the replay. Only works
on body scrolling.

#### xhr.js

Records XmlHttpRequests and replays them at the appropriate time
during the replay.

## Adding plugins

Plugins can be added by adding a file in lib/reanimator/plugins which
contains the plugin, then adding a line to lib/reanimator.js to tell the
build script to include the plugin in the build.

# Limitations

At this time, CSS mouse-related (notably, hover) events are not recorded or
replayed. Form data may not be filled in correctly during replay. Any pages
using frames or iframes will most likely not replay correctly.

You currently must use the included JQuery 1.8.3 library.

Currently, there is no infrastructure for easy record/replay. This is
in progress but not done.

Attaching recording capability to an existing application make take
significant work to ensure that all sources of non-determinism are
properly eliminated.

# API

## Reanimator.capture
**Capture non-deterministic input**

Call this method to begin logging non-deterministic input to your
JavaScript application. To capture a useful log, you must call
`Reanimator.capture` before such input occurs, but after libraries like
jQuery have been loaded.

The log is reset whenever this method is called.

## Reanimator.replay
**Replay a log of non-deterministic input**

### Arguments

- `log` - *object* - the log to replay, in the format emitted by
  `Reanimator.flush`
- `config` - *object* - configuration object
  - `config.delay` - *string* | *integer* - how long Reanimator should wait
    before replaying the next event in the log
      
      For a fixed delay, specify the number of ms between steps (the
      default is 0). If the string `'realtime'` is specified, Reanimator
      will make a good faith effort to replay the events with the actual
      delays recorded in the log.

## Reanimator.flush
**Return a copy of the current log**

Returns a copy of the current log as an object with the following
properties:

- `dates` - [ *number* ] - captured dates, specified in ms since the epoch
- `random` - [ *number* ] - captured random numbers generated by
  `Math.random`
- `events` - [ *object* ] - captured callback invocations

    Each element is an object with the following properties:
  - `type` - *string* - the type of the recorded callback
  - `time` - *number* - the time the callback was fired (ms since the epoch)
  - `details` - *any* - any additional details necessary to replay the
    callback

## Reanimator.cleanUp
**Stop capturing or replaying and restore native methods and objects**

This method does *not* clear the most recent log.

## Reanimator.plug
**Install a plugin to capture and replay some non-deterministic input**

### Arguments

- `type` - *string* - a unique string corresponding to the `type` property
  of any events the plugin will log
- `plugin` - *object* - the plugin to install

A plugin is an object that implements the following methods:

- `init`: initialize the plugin

    Called once, by `plug`

    Arguments
  - `native` - *object* - an object to store a reference to any native
    methods or objects the plugin interposes on

- `capture`: prepare to capture the input the plugin is responsible for

    Called by `Reanimator.capture`

- `cleanUp` - restore any native methods or objects the plugin interposed
  on

- `beforeReplay` - prepare to replay

    **Optional**; called by `Reanimator.replay` immediately before the
    first event is replayed

    Arguments
  - `log` - *object* - the log to be replayed
  - `config` - *object* - the replay configuration

- `replay` - replay a captured event

    **Required** if the plugin logs to `events`, **optional** otherwise

    Arguments
  - `event` - *object* - the event to replay, in the format specified above
    in `Reanimator.flush`

# License

Reanimator is made available under the [MIT
License](http://opensource.org/licenses/mit-license.php).

# Acknowledgements and Attribution

Thanks to [James Mickens](http://research.microsoft.com/en-us/people/mickens/),
[Jeremy Elson](http://research.microsoft.com/en-us/people/jelson/), and [Jon
Howell](http://research.microsoft.com/en-us/people/howell/) for their excellent
work on
[Mugshot](http://research.microsoft.com/apps/pubs/default.aspx?id=120937), which
inspired Reanimator.

The image `demos/tile-game/img/reanimator.jpg` is the work [Re-Animator]
(http://fav.me/d24n0v9) and is copyright (c) 2009
[~cool-slayer](http://cool-slayer.deviantart.com/) and made available under an
[Attribution-Noncommercial-No Derivative Works 3.0
License](http://creativecommons.org/licenses/by-nc-nd/3.0/).
