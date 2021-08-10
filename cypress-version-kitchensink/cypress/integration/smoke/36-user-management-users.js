import { cypressAdmin } from '../../support/constants';
import generate from '../../support/generate';
import { Form, DetailPane } from '../../support/high-level-api/testables';

const userName = generate.userName();

describe('user-management', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check groups', () => {
        it('should be able to create an user', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('User management')
                .click()
                .getByTestId('list-header-action-create-user')
                .click();
            cy.with(DetailPane)
                .with(Form)
                .do(
                    Form.fill({
                        'First name': 'Cypress first name',
                        'Last name': 'Cypress last name',
                        Username: `${userName}`,
                        Email: `${userName}@cypress.com`,
                        'Contact info': `Cypress ${userName} info`,
                    }),
                );
            selectInGroups('Testing Group', 'Group Admin');
            cy.getByTestId('save')
                .click()
                .getByTestId('notification-message')
                .contains('User created:');
        });
        it('should be able to check details and edit created user', () => {
            cy.closeNotificationIfOpen();

            cy
                // We need to expand pagination to 100 to make sure multiple tests will not fail
                .get('.pagination-advanced__config-page-size')
                .contains('100')
                .click()
                .wait(1000)
                // Find created user in displayed table
                .get('.data-table__tbody')
                .find('.user-col__name')
                .contains(`${userName}`)
                .should('be.visible')
                // Make sure that status is still PENDING
                .get('.data-table__table .data-table__td--main')
                .contains(`${userName}`)
                // to make sure I am are checking correct user we use parents()
                .parents('.data-table__tr')
                .find('.status-icon')
                .should('have.attr', 'title', 'pending')
                // Open detail pane of the user
                .get('.data-table__table .data-table__td--main')
                .contains(`${userName}`)
                .should('be.visible')
                .click()
                .wait(1500)
                .get('.detail-pane [data-test="dropdown-wrapper"]')
                .click()
                .getByTestId('dropdown-option-edit')
                .click()
                // Make user as a full admin for platform
                .get('[data-field-name="is_admin"] input')
                .click()
                .getByTestId('submit')
                .click()
                .getByTestId('notification-message')
                .contains('User updated:');
        });
        it('should be able to re-send activation email created user', () => {
            cy.closeNotificationIfOpen();

            cy.with(DetailPane).do(DetailPane.selectAction('Resend activation email'));
            cy
                // Make user as a full admin for platform
                .wait(1000)
                .getByTestId('notification-message')
                .contains('Activation email has been sent to user');
        });
        it('should be able to deactivated created user', () => {
            cy.closeNotificationIfOpen();
            cy.with(DetailPane).do(DetailPane.selectAction('Deactivate'));
            cy
                // Make user as a full admin for platform
                .wait(1000)
                .getByTestId('notification-message')
                .contains('User status has been successfully updated.');
        });
    });
});

function selectInGroups(group, user) {
    // Open graph an click on New button top create new graph
    cy.getByTestId('group-select-').click();
    cy.get('.in-select__option')
        .contains(`${group}`)
        .click()
        .getByTestId('groups[0][user_type]')
        .click();
    cy.get('.in-select__option')
        .contains(`${user}`)
        .click();
}
