import { expectToFailWithMessage } from '../../src/utils';

describe('Interaction', () => {
    it.only('with(instant appear).do(interaction) -- happypath', () => {
        cy.visit('/instant');
        cy.with('Table').do('Table', 'sort', ['Color', 'asc']);
        cy.get('th').contains('Color ↑');

        cy.with('Table').do('Table', 'sort', ['Fruit', 'desc']);
        cy.get('th').contains('Fruit ↓');
    });
    it('with(instant appear).do(interaction) yields table -- does not change subject', () => {
        cy.visit('/instant');
        cy.with('Table').do('Table', 'sort', ['Color', 'asc']).should('have.class', 'table');
    });
    it('with(appears in chunks).do(interaction<throw>) -- no retry', () => {
        cy.visit('/partial');
        cy.with('Table').do('Table', 'sort', ['not existing column', 'asc']);

        expectToFailWithMessage('Column does not exist with label "not existing column"');
    });
    it('with(instant appear).do(interaction).should -- no retry', () => {
        cy.visit('/partial');
        cy.with('Table').do('Table', 'sort', ['Color', 'asc']).should('have.class', 'table');

        expectToFailWithMessage('Column does not exist with label "Color"');
    });
    it('with(appears in chunks).do(interaction<not in subject>) -- should fail when cannot find element to perform the interaction', () => {
        cy.visit('/instant');
        cy.with('Table').find('th').first().do('Table', 'sort', ['Color', 'asc']);

        expectToFailWithMessage('No fiber found for interaction: Table.sort');
    });
    it('with(instant appear<multiple>).do(interaction) -- should fail with multiple subjects', () => {
        cy.visit('/multiple');
        cy.with('Table').do('Table', 'sort', ['Color', 'asc']);

        expectToFailWithMessage('Multiple fibers found for interaction: Table.sort');
    });
});
