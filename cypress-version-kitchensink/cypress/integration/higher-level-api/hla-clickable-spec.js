import { Clickable } from '../../support/high-level-api/testables';

describe('Clickable', () => {
    beforeEach(() => {
        cy.visit('/integration-test/clickable');
    });

    it('Clickable works with native click', () => {
        cy.get('[data-test="clickable-counter"]')
            .with(Clickable)
            .click();

        cy.contains('[data-test="clickable-counter"]', 'Value is 1');
    });

    it('Clickable works with selector', () => {
        cy.with(Clickable, 'Button bar').should('have.lengthOf', 1);
    });
});
