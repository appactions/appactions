const inquirer = require('inquirer');

const choices = [
    { label: 'Cypress version with Nextjs kitchensink', value: 'dev:cypress:nextjs' },
    { label: 'Cypress version with R3F kitchensink', value: 'dev:cypress:r3f' },
    { label: 'Standalone App Actions', value: 'dev:app-actions' },
];

inquirer
    .prompt([
        {
            type: 'list',
            name: 'project',
            message: 'Which project do you want to develop?',
            choices: choices.map(x => x.label),
        },
    ])
    .then(answers => {
        const project = choices.find(x => x.label === answers.project).value;
        console.log({ project });
    });
