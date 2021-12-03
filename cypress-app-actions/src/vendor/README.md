# vendor folder in react-app-actions

To make React App Actions work, we need to reuse some code from the `react-devtools-shared` package in the React repo. This package is unforunatelly not published to NPM, so we need to store our version in a vendor folder.

We want to own as little code duplication from React as possible. We only need a single function from it (the custom renderer, that extracts data to the React Dev tools), so we are building that function as a package, and we only store that build in the vendor folder.

How to upgrade the build when the patch cannot applied (or when developed):

1. Clone the React repo twice, second time name it `react-original`. Run `git clone git@github.com:facebook/react.git --depth 1` and `git clone git@github.com:facebook/react.git --depth 1 react-original` in this (vendor) folder. These folders are gitignored.
2. Change stuff based on `react-devtools-renderer.patch`.
3. Create the new patch with `git diff --no-index react-original/packages/react-devtools-shared/src/backend/renderer.js react/packages/react-devtools-shared/src/backend/renderer.js > react-devtools-renderer.patch`
4. Build the custom build with `yarn build:react-devtools-renderer` from the `react-app-actions` folder.
5. Done, test and commit the new build in `vendor/react-devtools-renderer-build`.
