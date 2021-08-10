import {
    Clickable,
    Collapsible,
    Notification,
    ListHeader,
    Input,
    FilterPanel,
} from '../../support/high-level-api/testables';

describe('Alert', () => {
    beforeEach(() => {
        cy.visit('/integration-test/legacy', {
            onLoad(window) {
                cy.spy(window, '__log').as('log');
            },
        });
    });

    it('ListHeader.openFilterPanel', () => {
        cy.with(ListHeader).do(ListHeader.openFilterPanel());

        cy.get('@log')
            .should('be.calledOnce')
            .should('be.calledWith', 'clicked on filter action');
    });

    it('ListHeader.activateActionByIcon', () => {
        cy.with(ListHeader).do(ListHeader.activateActionByIcon('plus'));

        cy.get('@log')
            .should('be.calledOnce')
            .should('be.calledWith', 'clicked on plus action');
    });
    it.skip('ListHeader.searchBy');

    it('Collapsible.toggle', () => {
        cy.with(Collapsible)
            .do(Collapsible.toggle())
            .do(Collapsible.toggle());

        cy.get('@log')
            .should('be.calledTwice')
            .should('be.calledWith', 'collapsible has been toggled');
    });
    it('Collapsible.fill', () => {
        cy.with(Collapsible).do(
            Collapsible.fill({
                Name: 'Foo bar baz.',
                'Add to set': true,
            }),
        );

        cy.get('@log').should('be.calledWith', 'form is filled with', { name: 'Foo bar baz.', add_to_set: true });
    });
    it('Collapsible.close', () => {
        cy.with(Collapsible).do(Collapsible.close());
        cy.with(Input).should('not.be.visible');
    });

    it('Notification.getNotification', () => {
        cy.with(Clickable, 'Show notification').click();
        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'This is a notification message.');
    });
    it('Notification.closeNotification', () => {
        cy.with(Clickable, 'Show notification').click();
        cy.with(Notification).do(Notification.closeNotification());
        cy.get('.notification', { timeout: 1000 }).should('not.exist');
    });

    it('FilterPanel.filterBy', () => {
        cy.with(FilterPanel).do(FilterPanel.filterBy('Filter', 'Bar'));
        cy.get('@log').should('be.calledWith', 'clicked on a filter option checkbox');
    });
    it('FilterPanel.hideExternalReferences', () => {
        cy.with(FilterPanel).do(FilterPanel.hideExternalReferences());
        cy.get('@log').should('be.calledWith', 'clicked on toggle switch');
    });
});
