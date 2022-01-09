#!/bin/bash

yarn workspace @appactions/cypress build
yarn workspace browser-extension build

mkdir packages/cypress-app-actions/build/browser-extension
cp -R packages/browser-extension/build packages/cypress-app-actions/build/browser-extension

# rm -rf packages/cypress-app-actions/build

# rm -rf browser-extension/build
# yarn workspace browser-extension build

# rm -rf cypress-app-actions/build
# yarn workspace @appactions/cypress build

# cp -R cypress-app-actions/build publish/build

# mkdir publish/build/browser-extension
# cp -R browser-extension/build publish/build/browser-extension/build

# cp cypress-app-actions/driver.js publish/driver.js
# cp cypress-app-actions/plugin.js publish/plugin.js
