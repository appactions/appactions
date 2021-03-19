#!/bin/sh

rm -rf packages/backend/vendor/react-devtools-shared
rm -rf /tmp/react

git clone git@github.com:facebook/react.git --depth=1 /tmp/react

cp -r /tmp/react/packages/react-devtools-shared ./packages/backend/vendor/react-devtools-shared

./node_modules/.bin/rollup --config packages/backend/vendor/rollup.config.js