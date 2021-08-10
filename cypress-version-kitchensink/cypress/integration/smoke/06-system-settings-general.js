import { cypressAdmin } from '../../support/constants';

describe('settings general', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.deleteSettings('server');
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check general settings', () => {
        it('should be able view default system general settings', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('System settings')
                .click()
                .get('.content-area__content')
                .contains('no-server-name-configured')
                .should('be.visible')
                .get('.content-area__content')
                .contains('30 minutes')
                .should('be.visible');
        });
        it('should be able modify default settings', () => {
            cy.getByTestId('edit-settings')
                .click()
                .get('[data-field-name="server_name"] input')
                .clear()
                .type('Cypress_smoke')
                .get('[data-field-name="jwt_expiration_delta"] input')
                .clear()
                .type('130')
                .get('[data-field-name="timezone"]')
                .selectChoose('(UTC+02:00) Europe/Chisinau')
                .getByTestId('submit')
                .click()
                .getByTestId('notification-message')
                .contains('General server configuration updated');
        });
    });
});
