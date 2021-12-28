import { expectToFailWithMessage } from '../../src/utils';

describe('Retrying', () => {
    it("with(appears delayed<spinner>) -- retry works", () => {
        cy.visit('/very-slow-spinner');
        cy.with('Table')
            .read('Table', 'getColumnOrThrow', ['Fruit'])
            .should('deep.equal', ['Fruit', 'Yes', 'Yes', 'No', 'Yes']);
    });
    it("with(appears delayed<spinner>) -- retry works when no `cy.do(...)` used", () => {
        cy.visit('/very-slow-spinner');
        cy.with('Table').contains('td', 'orange');
    });
    it('with(not existing) -- should timeout', () => {
        cy.visit('/instant');
        cy.with('NotExisting').should('exist');

        expectToFailWithMessage('Timed out retrying: Expected to find element: `NotExisting`, but never found it.');
    });
    it('with(not existing, \'foo, bar, baz\') -- should show the picker data in the exception', () => {
        cy.visit('/instant');

        cy.with('NotExisting', 'foo, bar, baz').should('exist');

        expectToFailWithMessage(
            'Timed out retrying: Expected to find element: `NotExisting (name: "foo, bar, baz")`, but never found it.',
        );
    });
    it('with(appears in chunks).do(interaction<without side-effect handling>) -- interaction should fail', () => {
        cy.visit('/partial');
        cy.with('Table').do('Table', 'sort', ['Color', 'asc']);
        cy.get('th').contains('Color ↑');

        expectToFailWithMessage('Column does not exist with label "Color"');
    });
    it('with(appears in chunks).do(interaction<pure dependency check>) -- interaction should not fail because of precheck', () => {
        cy.visit('/partial');
        cy.with('Table').do('Table', 'sortWithDependencyChecks', ['Color', 'asc']);
        cy.get('th').contains('Color ↑');
    });
    it('<anything>.do(interaction<advancedPurityComposition>) -- advanced side-effect handling', () => {
        cy.visit('/instant');
        cy.with('Table').do('Table', 'advancedPurityComposition');
        cy.contains('h1', '1. side-effect').should('have.lengthOf', 1);
        cy.contains('h2', '2. side-effect').should('have.lengthOf', 1);
    });
    it('with(appears in chunks) -- should retry is customPicker has thrown', () => {
        cy.visit('/partial');
        cy.with('Table', 'Name, Color, Fruit').should('exist');
    });
});
