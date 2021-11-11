import { registerCypressCommands, refreshSubject } from 'cypress-app-actions';

// registerCypressCommands({
//     defaultIsLoading($el) {
//         // TODO upgrade this
//         return !!$el.parent().find('.spinner').length;
//     },
// });

registerCypressCommands();

const req = require.context('../../src/', true, /\.cypress\.jsx?/);

req.keys().forEach(filename => {
    req(filename);
});

// React App Actions' refresh subject feature prevent the "detached from the DOM" errors
// only works if the subject went through either `cy.with` or `cy.do`
Cypress.Commands.overwrite('click', (click, subject, ...args) => {
    return click(refreshSubject(subject), ...args);
});
