import { Game } from '../support/testables/game';

context('Hello App Actions', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('42 is 42', () => {
        cy.wrap(42).should('equal', 42);
    });

    it('Game should exist', () => {
        cy.with(Game).should('exist');
    });
});
