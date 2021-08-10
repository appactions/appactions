import { DetailPane } from '../../support/high-level-api/testables';

describe('DetailPane', () => {
    beforeEach(() => {
        cy.visit('/integration-test/detail-pane');
    });

    it('DetailPane.getTitle', () => {
        cy.with(DetailPane)
            .do(DetailPane.getTitle())
            .should('eq', 'My detail pane title');
    });
    it('DetailPane.isActionActive', () => {
        cy.with(DetailPane)
            .do(DetailPane.isActionActive('Jupiter', 'Callisto'))
            .should('be.false');

        cy.with(DetailPane)
            .do(DetailPane.isActionActive('Jupiter', 'Europa'))
            .should('be.true');
    });
    it('DetailPane.selectAction', () => {
        cy.with(DetailPane).do(DetailPane.selectAction('Jupiter', 'Europa'));

        cy.get('[data-test="selected-action"]').contains('Europa');
    });
    it('DetailPane.close', () => {
        cy.with(DetailPane).should('exist');
        cy.with(DetailPane).do(DetailPane.close());
        cy.with(DetailPane).should('not.exist');
    });
    it('DetailPane.visitTab', () => {
        cy.with(DetailPane).do(DetailPane.visitTab('Tab 2'));
        cy.with(DetailPane).contains('Tab 2 content');
    });
});
