import { cypressAdmin } from '../../support/constants';

const auditFilterOptions = ['Timestamp', 'User', 'Method', 'Response'];

describe('settings audit', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check audit', () => {
        it('should be able view audit screen', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('System settings')
                .click()
                .getByTestId('top-nav-link-audit')
                .click()
                .get('.alert--info')
                .contains(
                    'The audit trail records events related to entities, datasets,' +
                        ' enrichers, incoming and outgoing feeds, rules and tasks. Use the quick filters to look for' +
                        ' data subsets based on a date range, or on one or more specific users, HTTP methods, or HTTP response status codes.',
                )
                .should('be.visible');
        });
        it('should be able to check audit filter', () => {
            cy.getByTestId('header-filter')
                .click()
                .wait(500);
            auditFilterOptions.forEach(option => {
                cy.get('.filter__group-title')
                    .contains(`${option}`)
                    .should('be.visible');
            });
        });
    });
});
