process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

process.on('unhandledRejection', err => {
    throw err;
});

const cypress = require('cypress');

(async () => {
    if (process.env.CI) {
        const result = await cypress.run({
            config: {
                record: !!process.env.CYPRESS_RECORD_KEY_FOR_APP_ACTIONS,
                key: process.env.CYPRESS_RECORD_KEY_FOR_APP_ACTIONS,
            },
        });
        if (result.runUrl) {
            console.log(`::set-output name=dashboardUrl::${result.runUrl}`);
        }
    } else {
        await cypress.open();
    }
})();
