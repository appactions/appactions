import { registerCypressCommands, refresh } from 'cypress-app-actions';

// registerCypressCommands({
//     defaultIsLoading($el) {
//         // TODO upgrade this
//         return !!$el.parent().find('.spinner').length;
//     },
// });

registerCypressCommands();

// React App Actions' refresh subject feature prevent the "detached from the DOM" errors
// only works if the subject went through either `cy.with` or `cy.do`
Cypress.Commands.overwrite('click', (click, subject, ...args) => {
    return click(refresh(subject), ...args);
});
