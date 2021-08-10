import { TableRow, ActionPicker } from '../../support/testables';

describe('Integration test for TableRow and ActionPicker', () => {
    beforeEach(() => {
        cy.visit('/integration-test/action-picker');
    });

    describe('ActionPicker', () => {
        it('ActionPicker should work', () => {
            cy.with(TableRow, 'Fruit', 'orange')
                .with(ActionPicker)
                .should('have.class', 'dropdown');
        });
        it('ActionPicker.isActionActive', () => {
            cy.with(TableRow, 'Fruit', 'orange')
                .with(ActionPicker)
                .do(ActionPicker.isItemActive('Jupiter', 'Galilean group', 'Callisto'))
                .should('be.false');

            cy.with(TableRow, 'Fruit', 'orange')
                .with(ActionPicker)
                .do(ActionPicker.isItemActive('Jupiter', 'Galilean group', 'Io'))
                .should('be.true');
        });
        it('ActionPicker.selectAction', () => {
            cy.with(TableRow, 'Fruit', 'orange')
                .with(ActionPicker)
                .do(ActionPicker.selectAction('Jupiter', 'Galilean group', 'Io'));

            cy.get('[data-test="action-picker-checker"]').contains('Selected item: Io');
        });
    });
});
