import { Table, TableRow } from '../../support/testables';

describe('Integration test for TableRow and ActionPicker', () => {
    beforeEach(() => {
        cy.visit('/integration-test/action-picker');
    });

    describe('TableRow', () => {
        it('TableRow should work', () => {
            cy.with(Table)
                .with(TableRow, 'Fruit', 'orange')
                .do(TableRow.getData())
                .should('deep.equal', ['Bar', 'orange', 'No']);
        });
        it('TableRow.getColumnLabels', () => {
            cy.with(Table)
                .with(TableRow, 'Fruit', 'orange')
                .do(TableRow.getColumnLabels())
                .should('deep.equal', ['Name', 'Fruit', 'Collaborator']);
        });
        it('TableRow.getCell', () => {
            cy.with(Table)
                .with(TableRow, 'Fruit', 'orange')
                .do(TableRow.getCell('Name'))
                .should('equal', 'Bar');
        });
        it('TableRow.isActionItemActive', () => {
            cy.with(TableRow, 'Fruit', 'orange')
                .do(TableRow.isActionItemActive('Jupiter', 'Galilean group', 'Callisto'))
                .should('be.false');

            cy.with(TableRow, 'Fruit', 'orange')
                .do(TableRow.isActionItemActive('Jupiter', 'Galilean group', 'Io'))
                .should('be.true');
        });
        it('TableRow.selectAction', () => {
            cy.with(TableRow, 'Fruit', 'orange').do(TableRow.selectAction('Jupiter', 'Galilean group', 'Io'));

            cy.get('[data-test="action-picker-checker"]').contains('Selected item: Io');
        });
        it('TableRow.click', () => {
            cy.with(TableRow, 'Fruit', 'orange').click();

            cy.get('[data-test="row-click-checker"]').contains('Row clicked: 1');
        });
    });
});
