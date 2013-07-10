# Animating Your Application

## Requirements

At the moment, your application must be using a version of JQuery compatible with JQuery 1.8.3. This requirement should be lifted soon - JQuery will no longer be required.

## Limitations

Please see the Limitations section in README.md for more information.

Please be aware that you may be required to tweak your application slightly in order to have fully functional replay. The amount of tweaking depends on the application.

# Setting up Reanimator

Reanimator is not able to record a single replay over multiple page loads. Reanimator is designed for applications that use XmlHTTPRequests and don't change the page URL frequently (except the URL hash).

## Adding the JavaScript

    <script src="js/reanimator/reanimator.js"></script>
    <script src="js/reanimator/reanimator-jquery.1.8.3.js"></script>
    <script src="js/reanimator/reanimator-load.js"></script>

Includes these three lines as the first scripts in the page you wish to reanimate. Remove any other script tags that import JQuery.

## Adding Reanimator's files

You need to place `js/reanimator` directory in your application. This includes the `reanimator.js`, `reanimator-jquery.1.8.3.js`, and `reanimator-load.js`. You can change the directory name from `js/reanimator` as long as you update the script tags from the previous step.

## Change your application ID

Open `reanimator-load.js` and find the line that says `'app_id' : 'XXXXXXX'`. Change the `XXXXXXX` to whatever ID you want. IDs much match the regular expression [A-Za-z0-9]{7} (in other words, 7 uppercase or lowercase letters or numbers, with no spaces).

Anyone with this ID will be able to view replays after the are uploaded to the replay server.

*The replay-viewer application is currently not secure for a multi-user environment.*

If you host your own replay server, you can disable viewing of replays by removing the corresponding line from replay-viewer, or require login to view replays by editing `main.py`.

## Upload the files

Reanimator is now set up. You should be able to open your application and use it normally. When the page is closed, the replay will be uploaded to the replay viewer and you should be able to go to http://replay-viewer.appspot.com/app/XXXXXXX to view the replays.