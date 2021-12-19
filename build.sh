#!/bin/bash

rm -rf publish/build

rm -rf browser-extension/build
yarn workspace browser-extension build

rm -rf cypress-app-actions/build
yarn workspace cypress-app-actions build

cp -R cypress-app-actions/build publish/build

mkdir publish/build/browser-extension
cp -R browser-extension/build publish/build/browser-extension/build

cp cypress-app-actions/driver.js publish/driver.js
cp cypress-app-actions/plugin.js publish/plugin.js
