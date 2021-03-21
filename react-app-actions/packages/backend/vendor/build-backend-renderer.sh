#!/bin/sh

rm -rf packages/backend/vendor/react-devtools-shared
rm -rf packages/backend/vendor/react-debug-tools
rm -rf packages/backend/vendor/react-reconciler
rm -rf packages/backend/vendor/shared
rm -rf /tmp/react

git clone git@github.com:facebook/react.git --depth=1 /tmp/react

cp -r /tmp/react/packages/react-devtools-shared ./packages/backend/vendor/react-devtools-shared
cp -r /tmp/react/packages/react-debug-tools ./packages/backend/vendor/react-debug-tools
cp -r /tmp/react/packages/react-reconciler ./packages/backend/vendor/react-reconciler
cp -r /tmp/react/packages/shared ./packages/backend/vendor/shared

./node_modules/.bin/rollup --config packages/backend/vendor/rollup.config.js