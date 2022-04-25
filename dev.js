const inquirer = require('inquirer');
const concurrently = require('concurrently');

process.on('unhandledRejection', err => {
    throw err;
});

const [quick] = process.argv.slice(2);

const choices = [
    {
        choice: { name: 'Cypress version with R3F kitchensink', value: 'r3f' },
        concurrently: [
            { name: 'core', command: 'yarn workspace @appactions/core dev:library', prefixColor: 'blue' },
            { name: 'driver', command: 'yarn workspace @appactions/driver dev', prefixColor: 'cyan' },
            { name: 'browser-ext', command: 'yarn workspace @appactions/core dev:extension', prefixColor: 'yellow' },
            // the cypress command also handles the dev server
            {
                name: 'cypress',
                command: 'yarn workspace @appactions/core wait-for-dev && yarn workspace kitchensink-r3f cypress',
                prefixColor: 'green',
            },
        ],
    },
    {
        choice: { name: 'Cypress version with Trello kitchensink', value: 'trello' },
        concurrently: [
            { name: 'core', command: 'yarn workspace @appactions/core dev:library', prefixColor: 'blue' },
            { name: 'driver', command: 'yarn workspace @appactions/driver dev', prefixColor: 'cyan' },
            { name: 'browser-ext', command: 'yarn workspace @appactions/core dev:extension', prefixColor: 'yellow' },
            // the cypress command also handles the dev server
            {
                name: 'cypress',
                command: 'yarn workspace @appactions/core wait-for-dev && yarn workspace kitchensink-trello cypress',
                prefixColor: 'green',
            },
        ],
    },
    {
        choice: { name: 'Cypress App Actions unit tests', value: 'core' },
        concurrently: [
            { name: 'core', command: 'yarn workspace @appactions/core dev:library', prefixColor: 'blue' },
            { name: 'browser-ext', command: 'yarn workspace @appactions/core dev:extension', prefixColor: 'yellow' },
            { name: 'driver', command: 'yarn workspace @appactions/driver dev', prefixColor: 'cyan' },
            { name: 'test-app', command: 'yarn workspace @appactions/core start', prefixColor: 'magenta' },
            {
                name: 'cypress',
                command: 'yarn workspace @appactions/core wait-for-dev && yarn workspace @appactions/core cypress',
                prefixColor: 'green',
            },
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
