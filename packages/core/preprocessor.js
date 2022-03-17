const fs = require('fs');
const path = require('path');
const tempWrite = require('temp-write');
const chokidar = require('chokidar');
const { preprocessFlows } = require('./build/flow');
const cyBrowserify = require('@cypress/browserify-preprocessor')();
const debug = require('debug')('app-actions-preprocessor');

/**
  Usage:

  ```
  const preprocessor = require('@appactions/preprocessor')
  module.exports = (on, config) => {
    on('file:preprocessor', preprocessor())
  }
  ```
*/

// bundled[filename] => promise
const bundled = {};

const preprocessFlowFiles = (filePath, outputPath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const specSource = preprocessFlows(content, { fileName: path.basename(filePath) });

    const writtenTempFilename = tempWrite.sync(specSource, path.basename(filePath) + '.js');
    debug('wrote temp file', writtenTempFilename);

    return cyBrowserify({
        filePath: writtenTempFilename,
        outputPath,
        // since the file is generated once, no need to watch it
        shouldWatch: false,
        on: () => {},
    });
};

const preprocessor = () => file => {
    const { filePath, outputPath, shouldWatch } = file;

    debug({ filePath, outputPath, shouldWatch });

    if (!filePath.endsWith('.yml') && !filePath.endsWith('.yaml')) {
        return cyBrowserify(file);
    }

    if (bundled[filePath]) {
        debug('already have bundle promise for file %s', filePath);
        return bundled[filePath];
    }

    if (shouldWatch) {
        debug('watching the file %s', filePath);

        // start bundling the first time
        bundled[filePath] = preprocessFlowFiles(filePath, outputPath);

        // and start watching the input file
        const watcher = chokidar.watch(filePath);
        watcher.on('change', () => {
            // tell the Test Runner to run the tests again
            debug('file %s has changed', filePath);
            bundled[filePath] = preprocessFlowFiles(filePath, outputPath);
            bundled[filePath].then(() => {
                debug('finished bundling, emit rerun');
                file.emit('rerun');
            });
        });

        // when the test runner closes this spec
        file.on('close', () => {
            debug('file %s close, removing bundle promise', filePath);
            delete bundled[filePath];
            watcher.close();
        });

        return bundled[filePath];
    }

    // non-interactive mode
    bundled[filePath] = preprocessFlowFiles(filePath, outputPath);
    return bundled[filePath];
};

module.exports = preprocessor;
module.exports.preprocessor = preprocessor;
