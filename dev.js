const inquirer = require('inquirer');
const concurrently = require('concurrently');

process.on('unhandledRejection', err => {
    throw err;
});

const choices = [
    {
        label: 'Cypress version with Nextjs kitchensink',
        concurrently: [
            { name: 'cyappactions', command: 'yarn workspace cypress-app-actions build --watch', prefixColor: 'blue' },
            { name: 'browser-ext', command: 'yarn workspace browser-extension dev', prefixColor: 'yellow' },
            { name: 'kitchensink', command: 'yarn workspace kitchensink-nextjs cypress', prefixColor: 'green' },
        ],
    },
    {
        label: 'Cypress version with R3F kitchensink',
        concurrently: [
            { name: 'cyappactions', command: 'yarn workspace cypress-app-actions build --watch', prefixColor: 'blue' },
            { name: 'browser-ext', command: 'yarn workspace browser-extension dev', prefixColor: 'yellow' },
            { name: 'kitchensink', command: 'yarn workspace kitchensink-r3f cypress', prefixColor: 'green' },
        ],
    },
    {
        label: 'Standalone React App Actions',
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

prompt([
    {
        type: 'list',
        name: 'project',
        message: 'Which project do you want to develop?',
        choices: choices.map(x => x.label),
    },
]).then(answers => {
    const commands = choices.find(x => x.label === answers.project).concurrently;

    concurrently(commands, {
        prefix: 'name',
        killOthers: ['failure', 'success'],
    });
});

// "dev:cypress:nextjs": "concurrently -n 'cyappactions,browser-ext,kitchensink' -c 'blue,yellow,green' 'yarn workspace cypress-app-actions build --watch' 'yarn workspace browser-extension dev' 'yarn workspace kitchensink-nextjs cypress' --kill-others",
// "dev:cypress:r3f": "concurrently -n 'cyappactions,browser-ext,kitchensink' -c 'blue,yellow,green' 'yarn workspace cypress-app-actions build --watch' 'yarn workspace browser-extension dev' 'yarn workspace kitchensink-r3f cypress' --kill-others",
// "dev:cypress-app-actions": "yarn workspace cypress-app-actions build:react-devtools-renderer && yarn workspace cypress-app-actions build && yarn dev:cypress",
