import { cypressAdmin } from '../../support/constants';

describe('settings proxy', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check proxy settings', () => {
        it('should be able view default proxy settings tab', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('System settings')
                .click()
                .getByTestId('top-nav-link-proxy-settings')
                .click()
                .get('.content-area__content')
                .contains('Proxy configuration is no longer available in the platform GUI.')
                .should('be.visible');
        });
    });
});
