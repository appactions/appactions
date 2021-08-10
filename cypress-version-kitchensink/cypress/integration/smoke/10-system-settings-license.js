import { cypressAdmin } from '../../support/constants';

describe('settings license', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.deleteSettings('license');
    });
    describe('Check license', () => {
        it('should be able view default license', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('System settings')
                .click()
                .getByTestId('top-nav-link-license-settings')
                .click()
                .getByTestId('no-licence-key-found,-click-here-to-add-one.')
                .should('be.visible')
                .get('.key-val-table__row')
                .contains('Missing')
                .should('be.visible');
        });
        it('should be able modify default license', () => {
            const licenseKey =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmF0aW9uX2RhdGUiOiIyMDIwLTEyLTMwIiwiaXNzdWVfZGF0ZSI6IjIwMTUtMTItMzAiLCJjdXN0b21lcl9uYW1lIjoiRWNsZWN0aWNJUSIsImxpY2Vuc2VfdHlwZSI6ImRldmVsb3BlciIsImNvbnRyYWN0X251bWJlciI6IjEifQ.P60QHJ1P5a6ut3b5azL6IMzQq0iy50lsC42Y22nir88';
            cy.getByTestId('no-licence-key-found,-click-here-to-add-one.')
                .click()
                .wait(2000);
            cy.get('[data-field-name="license_key"] textarea')
                .type(licenseKey)
                .getByTestId('submit')
                .click()
                .wait(1000)
                .getByTestId('notification-message')
                .contains('Product license was updated')
                .get('.key-val-table')
                .contains('Valid')
                .get('.key-val-table')
                .contains('12/30/2020')
                .get('.key-val-table')
                .contains('Developer license')
                // Check that settings are updated
                .getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('The software is licensed')
                .should('be.visible')
                .parentsUntil('.icon-base--color-green')
                .should('be.visible');
        });
        it('should be able to delete license', () => {
            cy.server();
            cy.route({
                method: 'DELETE',
                url: 'private/configurations/license',
                status: 200,
            }).as('licenseDelete');
            cy.getByTestId('update-license-key')
                .click()
                .getByTestId('remove-settings')
                .click()
                .get('.confirm [data-test="delete"]')
                .click();
            cy.wait('@licenseDelete');
            cy.getByTestId('no-licence-key-found,-click-here-to-add-one.').should('be.visible');
        });
    });
});
