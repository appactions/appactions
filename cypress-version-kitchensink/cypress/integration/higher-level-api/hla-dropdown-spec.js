import { Dropdown } from '../../support/high-level-api/testables';

describe('IntegrationTest for Dropdown', () => {
    beforeEach(() => {
        cy.visit('/integration-test/dropdown');
    });

    it('Dropdown.isItemActive should get activity status', () => {
        cy.with(Dropdown)
            .do(Dropdown.isItemActive('Earth'))
            .should('be.false');

        cy.with(Dropdown)
            .do(Dropdown.isItemActive('Neptune'))
            .should('be.true');
    });

    it('Dropdown.isItemActive should support chained dropdown', () => {
        cy.with(Dropdown)
            .do(Dropdown.isItemActive('Jupiter', 'Galilean group', 'Callisto'))
            .should('be.false');

        cy.with(Dropdown)
            .do(Dropdown.isItemActive('Jupiter', 'Galilean group', 'Io'))
            .should('be.true');
    });

    it('Dropdown.select should support chained dropdown', () => {
        cy.with(Dropdown).do(Dropdown.select('Jupiter', 'Galilean group', 'Io'));

        cy.get('[data-test="dropdown-checker"]').contains('Selected item: Io');
    });
});
