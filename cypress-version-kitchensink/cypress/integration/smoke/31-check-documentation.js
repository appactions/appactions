import { cypressAdmin } from '../../support/constants';

describe('documentation', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.logout();
    });

    describe('Check if documentation is installed', () => {
        it('should check documentation page', () => {
            // Should open and verify documentation page
            cy.visit('/documentation');
            // Check URL changed
            cy.url().should('include', 'Company_Platform_documentation_home');
            // Check title is there
            cy.get('.ht-content-header').contains('Company Platform documentation home');

            // Check sidebar menu loaded
            const getSidebar = () =>
                cy
                    .get('iframe#ht-nav')
                    .its('0.contentDocument')
                    .its('body')
                    .then(cy.wrap);

            getSidebar().contains('.ht-nav-page-link', 'Install Configure Upgrade');
            getSidebar().contains('.ht-nav-page-link', 'Get to know the platform');
            getSidebar().contains('.ht-nav-page-link', 'Work with intelligence');
        });
    });
});
