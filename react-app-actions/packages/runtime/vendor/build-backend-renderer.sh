#!/bin/sh

rm -rf packages/runtime/vendor/react-devtools-shared
rm -rf packages/runtime/vendor/react-debug-tools
rm -rf packages/runtime/vendor/react-reconciler
rm -rf packages/runtime/vendor/shared
rm -rf /tmp/react

git clone git@github.com:facebook/react.git --depth=1 /tmp/react

cp -r /tmp/react/packages/react-devtools-shared ./packages/runtime/vendor/react-devtools-shared
cp -r /tmp/react/packages/react-debug-tools ./packages/runtime/vendor/react-debug-tools
cp -r /tmp/react/packages/react-reconciler ./packages/runtime/vendor/react-reconciler
cp -r /tmp/react/packages/shared ./packages/runtime/vendor/shared

git apply packages/runtime/vendor/react-devtools-renderer.patch

./node_modules/.bin/rollup --config packages/runtime/vendor/rollup.config.js
