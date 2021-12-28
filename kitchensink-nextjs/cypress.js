process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// require('dotenv').config();

process.on('unhandledRejection', err => {
    throw err;
});

// const fetch = require('node-fetch');
const cypress = require('cypress');
const execSync = require('child_process').execSync;

if (process.env.CI) {
    cypress
        .run({
            record: !!process.env.CYPRESS_RECORD_KEY,
            key: process.env.CYPRESS_RECORD_KEY,
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
} else if (process.env.USE_VERCEL) {
    const command = 'vercel list kitchensink-nextjs --meta githubCommitRef=$(git rev-parse --abbrev-ref HEAD)';

    const vercelList = execSync(command).toString();
    const vercelUrl = vercelList.match(/kitchensink-nextjs-[a-zA-Z0-9-]+\.vercel\.app/);
    if (vercelUrl) {
        const baseUrl = vercelUrl[0];

        cypress.open({
            config: {
                baseUrl: `https://${baseUrl}`,
            },
        });
    } else {
        console.error('Could not fetch Vercel deployment');
        console.error(vercelList);
        process.exit(1);
    }
} else {
    // const query = new URLSearchParams();
    // query.set('gitBranch', execSync('git rev-parse --abbrev-ref HEAD').toString().trim());
    // query.set('teamId', 'team_EOw3rZasNNXMUL4TMDEJrr9D');
    // query.set('decrypt', true);
    
    // fetch(`https://vercel.com/api/v7/projects/kitchensink-nextjs/env?${query}`, {
    //     headers: {
    //         authorization: `bearer ${process.env.VERCEL_TOKEN_FOR_LOCAL_DEVELOPMENT}`,
    //     },
    //     method: 'GET',
    // })
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log('data:', data);
    //     });

    // normal localhost dev
    cypress.open();
}
