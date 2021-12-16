'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

var addPlugin = on => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.extensions.push(path__default['default'].resolve('../browser-extension/build'));
      launchOptions.args.push('--auto-open-devtools-for-tabs');
      launchOptions.args.push('--enable-logging');
      launchOptions.args.push('--v=1');
      return launchOptions;
    }
  });
}; // TODO this file needs to be cjs, because it will be running in Node; transpile this maybe?

var plugin = {
	addPlugin: addPlugin
};

exports.addPlugin = addPlugin;
exports.default = plugin;
