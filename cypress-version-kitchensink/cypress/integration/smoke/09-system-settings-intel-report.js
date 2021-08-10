import { cypressAdmin } from '../../support/constants';

describe('settings intel-report', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.deleteSettings('intel-report');
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check intel report default view', () => {
        it('should be able view default intel-report', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('System settings')
                .click()
                .getByTestId('top-nav-link-intel-report-settings')
                .click()
                .getByTestId('edit-settings')
                .should('be.visible')
                .get('.content-area__content')
                .contains('There are no settings')
                .should('be.visible');
        });
        it('should be able to check and fill in intel-report form', () => {
            cy.getByTestId('edit-settings')
                .click()
                .get('[data-field-name="contact"] textarea')
                .type('Cypress default contact information for reports')
                .get('[data-field-name="terms"] textarea')
                .type('Default Terms of use of Cypress tests')
                // This is a dummy logo to make sure it works, myrequired changes after some time
                .get('[data-field-name="logo_url"] input')
                .type('http://unitjs.com/assets/img/logo.png')
                .getByTestId('preview-and-test')
                .click()
                .get('.in-form img')
                .should('have.attr', 'alt', 'Logo preview')
                .getByTestId('submit')
                .click()
                .getByTestId('notification-message')
                .contains('Configuration updated');
        });
        it('Should be able to check edit intel-report', () => {
            cy.closeNotificationIfOpen();

            cy.getByTestId('edit-settings')
                .click()
                .get('[data-field-name="contact"] textarea')
                .clear()
                .type('Cypress default contact information for reports EDITED')
                .get('[data-field-name="terms"] textarea')
                .clear()
                .type('Default Terms of use of Cypress tests EDITED')
                .getByTestId('submit')
                .click()
                .getByTestId('notification-message')
                .contains('Configuration updated')
                .get('.key-val-table__value')
                .contains('Cypress default contact information for reports EDITED')
                .should('be.visible')
                .get('.key-val-table__value')
                .contains('Default Terms of use of Cypress tests EDITED')
                .should('be.visible');
        });
        it('should be able to reset configured intel-report settings', () => {
            cy.closeNotificationIfOpen();
            cy.getByTestId('edit-settings')
                .click()
                .getByTestId('reset-settings')
                .click()
                .get('.confirm [data-test="reset"]')
                .click()
                .wait(500)
                .getByTestId('notification-message')
                .contains('Configuration removed');
        });
    });
});
