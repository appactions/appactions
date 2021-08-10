import { cypressAdmin } from '../../support/constants';

const celery = [
    'discovery',
    'discovery-priority',
    'enrichers',
    'enrichers-priority',
    'entity-rules-priority',
    'extract-rules-priority',
    'incoming-transports',
    'outgoing-feeds',
    'outgoing-feeds-priority',
    'outgoing-transports',
    'outgoing-transports-priority',
    'reindexing',
    'retention-policies',
    'retention-policies-priority',
    'utilities',
    'utilities-priority',
    'incoming-transports-priority',
];

const services = [
    'configuration',
    'elasticsearch',
    'kibana',
    'neo4j',
    'neo4j-batcher',
    'opentaxii',
    'postgresql-11',
    'redis',
    'mail-server',
    'statsite',
    'postgresql-timezone',
    'timezone',
];

// Wait for Celery worker status to complete (2min for now...)
const HEALTH_CHECK_TIMEOUT = 2 * 60 * 1000;

describe('system status', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.logout();
    });

    context('check system status', () => {
        it('should show the system status as running', () => {
            cy.get(':nth-child(4) > .navigation__settings-item').click();
            cy.get('.dropdown__option')
                // It takes about 20 seconds for the Celery workers to be ready, so increase the timeout
                .contains('System running', { timeout: HEALTH_CHECK_TIMEOUT });
        });

        it('should show the Health status modal', () => {
            cy.get('.dropdown__option')
                .contains('running')
                .click();
            cy.get('.modal__header').contains('System Health');
        });
        it('should be able to check status of the platform celery', () => {
            cy.getByTestId('tab-item')
                .contains('Celery')
                .click();

            // It takes about 20 seconds for the Celery workers to be ready, so increase the timeout
            cy.get('.modal__content .data-table__tr td:first-child .collapsible-row-content', {
                timeout: HEALTH_CHECK_TIMEOUT,
            }).then($content => {
                const celery_list = $content
                    .toArray()
                    .map(el =>
                        Cypress.$(el)
                            .attr('title')
                            .trim(),
                    )
                    .sort();
                cy.log('I log array', celery_list);
                expect(celery_list).to.deep.equal(celery.sort());
            });
        });
        it('should be able to check status of the platform SERVICES', () => {
            cy.getByTestId('tab-item')
                .contains('Services')
                .click();

            cy.get('.tabs__link--active').contains('Services');

            cy.get('.modal__content .data-table__tr td:first-child .collapsible-row-content').then($content => {
                const services_list = $content
                    .toArray()
                    .map(el =>
                        Cypress.$(el)
                            .attr('title')
                            .trim(),
                    )
                    .sort();
                expect(services_list).to.deep.equal(services.sort());
            });
        });
    });
});
