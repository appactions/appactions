import { Game } from '../support/testables/game';

context('Hello App Actions', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Game should exist', () => {
        cy.get('#root canvas').should('exist')
        cy.with(Game).should('exist');
    });
});
