before(() => {
    cy.clearCookie('next-auth.session-token');
    cy.clearCookie('next-auth.callback-url');
    cy.clearCookie('next-auth.csrf-token');
    cy.clearCookie('__Secure-next-auth.session-token');
    cy.clearCookie('__Secure-next-auth.callback-url');
    cy.clearCookie('__Secure-next-auth.csrf-token');
});

afterEach(function () {
    if (this.currentTest.state === 'failed') {
        Cypress.runner.stop();
    }
});
