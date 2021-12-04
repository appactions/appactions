const inquirer = require('inquirer');
const concurrently = require('concurrently');

process.on('unhandledRejection', err => {
    throw err;
});

const [quick] = process.argv.slice(2);

const choices = [
    {
        choice: { name: 'Cypress version with Nextjs kitchensink', value: 'next' },
        concurrently: [
            { name: 'cyappactions', command: 'yarn workspace cypress-app-actions dev', prefixColor: 'blue' },
            { name: 'browser-ext', command: 'yarn workspace browser-extension dev', prefixColor: 'yellow' },
            { name: 'kitchensink-nextjs', command: 'yarn workspace kitchensink-nextjs cypress', prefixColor: 'green' },
        ],
    },
    {
        choice: { name: 'Cypress version with R3F kitchensink', value: 'r3f' },
        concurrently: [
            { name: 'cyappactions', command: 'yarn workspace cypress-app-actions dev', prefixColor: 'blue' },
            { name: 'browser-ext', command: 'yarn workspace browser-extension dev', prefixColor: 'yellow' },
            { name: 'kitchensink-r3f', command: 'yarn workspace kitchensink-r3f cypress', prefixColor: 'green' },
        ],
    },
    {
        choice: { name: 'Cypress App Actions unit tests', value: 'unit' },
        concurrently: [
            { name: 'cyappactions', command: 'yarn workspace cypress-app-actions dev', prefixColor: 'blue' },
            { name: 'test-app', command: 'yarn workspace cypress-app-actions start', prefixColor: 'yellow' },
            { name: 'cypress', command: 'yarn workspace cypress-app-actions cypress', prefixColor: 'green' },
        ],
    },
    {
        choice: { name: 'Standalone React App Actions', value: 'standalone' },
        concurrently: [
            // TODO: improve this once react-app-actions is developed again
            {
                name: 'reactappactions',
                command: 'yarn workspace react-app-actions rollup --config rollup.config.js --watch',
                prefixColor: 'blue',
            },
        ],
    },
];

const prompt = inquirer.createPromptModule({ output: process.stderr });

prompt(
    [
        {
            type: 'list',
            name: 'project',
            message: 'Which project do you want to develop?',
            choices: choices.map(({ choice }) => {
                return {
                    name: `${choice.name} [${choice.value}]`,
                    value: choice.value,
                };
            }),
        },
    ],
    quick ? { project: quick } : undefined,
).then(answers => {
    const picked = choices.find(x => x.choice.value === answers.project);

    if (!picked) {
        throw new Error('Could not find option');
    }

    concurrently(picked.concurrently, {
        prefix: 'name',
        killOthers: ['failure', 'success'],
    });
});

// "dev:cypress:nextjs": "concurrently -n 'cyappactions,browser-ext,kitchensink' -c 'blue,yellow,green' 'yarn workspace cypress-app-actions build --watch' 'yarn workspace browser-extension dev' 'yarn workspace kitchensink-nextjs cypress' --kill-others",
// "dev:cypress:r3f": "concurrently -n 'cyappactions,browser-ext,kitchensink' -c 'blue,yellow,green' 'yarn workspace cypress-app-actions build --watch' 'yarn workspace browser-extension dev' 'yarn workspace kitchensink-r3f cypress' --kill-others",
// "dev:cypress-app-actions": "yarn workspace cypress-app-actions build:react-devtools-renderer && yarn workspace cypress-app-actions build && yarn dev:cypress",