import { cypressAdmin } from '../../support/constants';

describe('settings email', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.deleteSettings('email');
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check email settings', () => {
        it('should be able view default email settings', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('System settings')
                .click()
                .getByTestId('top-nav-link-email-settings')
                .click()
                .get('.content-area__content')
                .contains('There are no settings')
                .should('be.visible');
        });
        it('should be able modify default email settings', () => {
            cy.getByTestId('edit-settings')
                .click()
                // Input a dummy mail - it will not work on user creation!!!
                .get('[data-field-name="from_email"] input')
                .type('qa@ecypress.iw')
                .get('[data-field-name="reply_to"] input')
                .type('qa@cypress-reply.iw')
                .getByTestId('submit')
                .click()
                .getByTestId('notification-message')
                .contains('Email configuration updated');
        });
        it('should be able to reset settings', () => {
            cy.closeNotificationIfOpen();

            cy.getByTestId('edit-settings')
                .click()
                .getByTestId('reset-settings')
                .click()
                .get('.confirm [data-test="reset"]')
                .click()
                .wait(500)
                .getByTestId('notification-message')
                .contains('Email configuration removed.');
        });
        it('put back configuration for next tests', () => {
            cy.closeNotificationIfOpen();

            cy.getByTestId('edit-settings')
                .click()
                // Input a dummy mail - it will not work on user creation!!!
                .get('[data-field-name="from_email"] input')
                .type('qa@ecypress.iw')
                .get('[data-field-name="reply_to"] input')
                .type('qa@cypress-reply.iw')
                .getByTestId('submit')
                .click()
                .getByTestId('notification-message')
                .contains('Email configuration updated');
        });
    });
});
