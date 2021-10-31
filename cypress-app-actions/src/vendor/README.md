# vendor folder in react-app-actions

To make React App Actions work, we need to reuse some code from the `react-devtools-shared` package in the React repo. This package is unforunatelly not published to NPM, so we need to store our version in a vendor folder.

We want to own as little code duplication from React as possible. We only need a single function from it (the custom renderer, that extracts data to the React Dev tools), so we are building that function as a package, and we only store that build in the vendor folder.

How to upgrade the build:

1. Run `git clone git@github.com:facebook/react.git --depth 1` in this (vendor) folder. It is gitignored.
2. Apply `react-devtools-renderer.patch` to have our custom tweaks. Ideally it won't have git conflict. If it has, use the patch as a guide to see what needs to be manually updated. Please don't forget to update the patch.
3. Build the custom build with `yarn build:react-devtools-renderer` from the `react-app-actions` folder.
4. Done, test and commit the new build in `vendor/react-devtools-renderer-build`.
