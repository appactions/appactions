process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

process.on('unhandledRejection', err => {
    throw err;
});

const cypress = require('cypress');

if (process.env.CI) {
    cypress
        .run({
            record: !!process.env.CYPRESS_RECORD_KEY_FOR_APP_ACTIONS,
            key: process.env.CYPRESS_RECORD_KEY_FOR_APP_ACTIONS,
        })
        .then(result => {
            if (result.failures) {
                console.error('Could not execute tests');
                console.error(result.message);
                process.exit(1);
            }

            if (result.totalFailed) {
                process.exit(1);
            } else {
                process.exit(0);
            }
        })
        .catch(err => {
            console.error(err.message);
            process.exit(1);
        });
} else {
    cypress.open();
}
