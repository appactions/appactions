# Browser Extension

To run it in dev mode, use `yarn dev:cypress` from the repo root!

## Dev tips

### Debug the popup panel

Right click on the icon, and Inspect Popup.

### Debug a devtools panel

Access `chrome-extension://jcckhadkikcgdlgejoflohhncchdgiie/main.html` in your browser, where the id is the extension id.

### Debug the Chrome instance

1. Run the Chrome instance with the arguments `--enable-logging --v=1`.
2. Find the PID in the Activity Monitor
3. Run `lsof -p <PID> | grep chrome_debug.log` and you get the log file path.

Adding the argument to Chrome when used from Cypress:
```
module.exports.addPlugin = on => {
    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push('--enable-logging');
            launchOptions.args.push('--v=1');
            return launchOptions;
        }
    });
};
```
