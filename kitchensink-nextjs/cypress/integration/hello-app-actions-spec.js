// import { Logo } from '../support/testables/logo';

describe('Hello App Actions', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Alert should exist', () => {
        cy.with('Logo').should('exist');
    });
});
