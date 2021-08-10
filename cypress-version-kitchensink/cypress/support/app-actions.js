import { registerCypressCommands, refreshSubject } from 'react-app-actions';

registerCypressCommands({
    defaultIsLoading($el) {
        return !!$el.parent().find('.spinner').length;
    },
});

const req = require.context('../../src/', true, /\.cypress\.jsx?/);

req.keys()
    // this is a temporary solution, needs to exclude the example React App Actions from here
    .filter(filename => !filename.includes('/vendor/'))
    .forEach(filename => {
        req(filename);
    });

// React App Actions' refresh subject feature prevent the "detached from the DOM" errors
// only works if the subject went through either `cy.with` or `cy.do`
Cypress.Commands.overwrite('click', (click, subject, ...args) => {
    return click(refreshSubject(subject), ...args);
});
