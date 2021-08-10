import { cypressAdmin } from '../../support/constants';

describe('settings account-policy', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.deleteSettings('account-policy');
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check account policy default view', () => {
        it('should be able view default account policy', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('System settings')
                .click()
                .getByTestId('top-nav-link-account-policy')
                .click()
                .getByTestId('edit-account-policy')
                .should('be.visible')
                // Confirm that all fields are visible and have default value
                .get('h2')
                .contains('Password')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('Minimum length')
                .parentsUntil('.key-val-table__row span')
                .contains('10 characters')
                .should('be.visible')
                .get('h2')
                .contains('Required characters')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('At least one number')
                .parentsUntil('.key-val-table__row span')
                .contains('Yes')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('At least one special character')
                .parentsUntil('.key-val-table__row span')
                .contains('Yes')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('At least one capital letter')
                .parentsUntil('.key-val-table__row span')
                .contains('Yes')
                .should('be.visible')
                .get('.content-section__content .help-text')
                .contains(`Users are not allowed to use previous passwords. Trivial passwords are not allowed.`)
                .should('be.visible')
                .get('h2')
                .contains('Locked account')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('Maximum of failed attempts')
                .get('.key-val-table__value')
                .contains('5')
                .should('be.visible')
                .get('.content-section__content .help-text')
                .contains('Account will remain locked until administrator unlocks it.')
                .should('be.visible');
        });
        it('should be able to modify default settings', () => {
            cy.getByTestId('edit-account-policy')
                .click()
                .get('[data-field-name="password_length[password_min_length]"] input')
                .clear()
                .type('8')
                .get('[data-field-name="password_requirements[password_requires_numbers]"] input')
                .click()
                .get('[data-field-name="password_requirements[password_requires_special_chars]"] input')
                .click()
                .get('[data-field-name="password_requirements[password_requires_capital_letters]"] input')
                .click()
                .get('[data-field-name="lockout_attempts"] input')
                .clear()
                .type('4')
                .getByTestId('submit')
                .click()
                .getByTestId('notification-message')
                .contains('Configuration updated')
                .get('.key-val-table__key')
                .contains('Minimum length')
                .parentsUntil('.key-val-table__row span')
                .contains('8 characters')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('At least one number')
                .parent()
                .contains('No')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('At least one special character')
                .parent()
                .contains('No')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('At least one capital letter')
                .parent()
                .contains('No')
                .should('be.visible')
                .get('.key-val-table__key')
                .contains('Maximum of failed attempts')
                .get('.key-val-table__value')
                .contains('4')
                .should('be.visible');
        });
        it('should be able to reset configured account policy settings', () => {
            cy.closeNotificationIfOpen();
            cy.getByTestId('edit-account-policy')
                .click()
                .getByTestId('reset-settings')
                .click()
                .get('.modal__content [data-test="confirm"]')
                .click()
                .wait(500);
            cy.getByTestId('notification-message').contains('Configuration removed');
        });
    });
});
