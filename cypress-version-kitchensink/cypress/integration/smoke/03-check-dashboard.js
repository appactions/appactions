import { cypressAdmin } from '../../support/constants';

const dashboards = [
    'Ingested entities by feed(24h)',
    'Exported entities by feed(24h)',
    'Ingested entities (unique)(24h)',
    'Exported observables by type(24h)',
    'Total entities by type',
    'Discoveries',
    'Exported observables by feed(24h)',
    'My tasks change',
    'Exported entities by type(24h)',
    'Total observables by type(top 10)',
];

const tinyCards = ['total entities and observables', 'total entities', 'total observables', 'my open tasks'];

const timeFrames = ['24h', '72h', '1 week', '1 month', '1 year'];

describe('dashboards', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.clearWorkInProgress();
    });
    after(() => {
        cy.logout();
    });
    context('check dashboard', () => {
        it('should be able to check if large dashboards are displayed', () => {
            // Large cards displayed on the main screen
            window.onload = () => {
                cy.get('.navigation__panel-button--is-logo')
                    .wait(1000)
                    .get('h3')
                    .then($content => {
                        const dashboards_list = $content
                            .toArray()
                            .map(el =>
                                Cypress.$(el)
                                    .text()
                                    .trim(),
                            )
                            .sort();
                        expect(dashboards_list).to.deep.equal(dashboards.sort());
                    });
            };
        });
        it('should be able to check if small dashboards are displayed', () => {
            // Small cards from the top of the screen
            window.onload = () => {
                cy.get('.tiny-card__description').then($content => {
                    const tinyCards_list = $content
                        .toArray()
                        .map(el =>
                            Cypress.$(el)
                                .text()
                                .trim(),
                        )
                        .sort();
                    expect(tinyCards_list).to.deep.equal(tinyCards.sort());
                });
            };
        });
        it('should be able to check if all other items are displayed', () => {
            // Tasks for current user
            cy.get('.widget-grid-item__title').contains('My tasks');
            // Time-frame buttons available for dashboard
            cy.get('[data-test^="list-header-action"]').then($content => {
                const timeFrames_list = $content
                    .toArray()
                    .map(el =>
                        Cypress.$(el)
                            .text()
                            .trim(),
                    )
                    .sort();
                expect(timeFrames_list).to.deep.equal(timeFrames.sort());
            });
        });
        it('should be able to click on all time-frame buttons', () => {
            // Default active time-frame should be 24h
            cy.get('.list-header__action-link--active').contains('24h');
            // Click on each time-frame button
            cy.getByTestId('list-header-action-72h').click();
            cy.get('.list-header__action-link--active').contains('72h');
            cy.getByTestId('list-header-action-1-week').click();
            cy.get('.list-header__action-link--active').contains('week');
            cy.getByTestId('list-header-action-1-month').click();
            cy.get('.list-header__action-link--active').contains('month');
            cy.getByTestId('list-header-action-1-year').click();
            cy.get('.list-header__action-link--active').contains('year');
        });
    });
});
