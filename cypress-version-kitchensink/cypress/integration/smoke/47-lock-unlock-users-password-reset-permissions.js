import { createRoleWithoutPermissions, createUserRoleIncludingPermissions } from '../../support/api/roles';
import { createActiveUser, updateExistingUser } from '../../support/api/users';
import { generate } from '../../utils';
import { tempUserPassword } from '../../support/constants';
import {
    ActionPicker,
    DetailPane,
    Notification,
    Search,
    Table,
    TableRow,
} from '../../support/high-level-api/testables';
import apiConnect from '../../support/api/api-connect';

describe('Lock | Unlock Users Password reset', () => {
    const username = generate.userName();
    const test_username = generate.userName();
    const password = tempUserPassword;
    before(() => {
        createUserRoleIncludingPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username, password, roles: [role.id] }),
        );
        //used for activate/deactivate scenarios
        createRoleWithoutPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username: test_username, password, roles: [role.id] }),
        );
    });

    beforeEach(() => {
        cy.login(username, password);
        cy.clearWorkInProgress(
            apiConnect({
                username: username,
                password: password,
            }),
        );
        cy.goto('/user-management/users');
    });

    it.skip('Deactivate an user using detail pane action picker', () => {
        cy.with(Search).do(Search.search(test_username));

        cy.with(Table)
            .with(TableRow, 'Username', test_username)
            .click();

        cy.with(DetailPane).do(DetailPane.selectAction('Deactivate'));

        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'User status has been successfully updated.');
    });

    it.skip('Activate an user using detail pane action picker', () => {
        cy.with(Search).do(Search.search(test_username));
        cy.with(Table)
            .with(TableRow, 'Username', test_username)
            .click();

        cy.with(DetailPane).do(DetailPane.selectAction('Activate'));

        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'User status has been successfully updated.');
    });

    it('Deactivate an user using row action picker', () => {
        cy.with(Search).do(Search.search(test_username));

        cy.with(Table)
            .with(TableRow, 'Username', `${test_username}`)
            .with(ActionPicker)
            .do(ActionPicker.selectAction('Deactivate'));

        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'User status has been successfully updated.');
    });

    it('Activate an user using row action picker', () => {
        cy.with(Search).do(Search.search(test_username));

        cy.with(Table)
            .with(TableRow, 'Username', `${test_username}`)
            .with(ActionPicker)
            .do(ActionPicker.selectAction('Activate'));

        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'User status has been successfully updated.');
    });

    it('Reset password for an user using detail pane action picker', () => {
        const userName = generate.userName();
        createRoleWithoutPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username: userName, password, roles: [role.id] }),
        );
        cy.reload(true);

        cy.with(Search).do(Search.search(userName));

        cy.with(Table)
            .with(TableRow, 'Username', userName)
            .click();
        cy.with(DetailPane).do(DetailPane.selectAction('Force password reset'));

        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'Force reset password successfully finished.');
    });

    it('Reset password for an user row action picker', () => {
        const userName = generate.userName();
        createRoleWithoutPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username: userName, password, roles: [role.id] }),
        );

        cy.reload(true);

        cy.with(Search).do(Search.search(userName));

        cy.with(Table)
            .with(TableRow, 'Username', `${userName}`)
            .with(ActionPicker)
            .do(ActionPicker.selectAction('Force password reset'));

        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'Force reset password successfully finished.');
    });

    it.skip('Deactivate bulk users', () => {
        //create one more user in order to make bulk operations
        const anotherUsername = generate.userName();
        createRoleWithoutPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username: anotherUsername, password, roles: [role.id] }),
        );
        cy.reload(true);

        //select one user
        cy.with(Search).do(Search.search(test_username));
        cy.with(Table)
            .with(TableRow, 'Username', `${test_username}`)
            .find('.checkbox__checkbox')
            .click();

        //select another user
        cy.with(Search).do(Search.search(anotherUsername));
        cy.with(Table)
            .with(TableRow, 'Username', `${anotherUsername}`)
            .find('.checkbox__checkbox')
            .click();

        cy.get('.action-bar')
            .with(ActionPicker)
            .do(ActionPicker.selectAction('Deactivate'));

        //validating the notification
        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'User bulk action successfully finished.');
    });

    it.skip('Activate bulk users', () => {
        //create one more user in order to make bulk operations
        const anotherUsername = generate.userName();
        createRoleWithoutPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username: anotherUsername, password, roles: [role.id] }),
        );

        updateExistingUser(test_username, { is_pending: false, is_active: false, is_password_reset_requested: false });
        updateExistingUser(anotherUsername, {
            is_pending: false,
            is_active: false,
            is_password_reset_requested: false,
        });

        cy.reload(true);

        //select one user
        cy.with(Search).do(Search.search(test_username));
        cy.with(Table)
            .with(TableRow, 'Username', `${test_username}`)
            .find('.checkbox__checkbox')
            .click();

        //select another user
        cy.with(Search).do(Search.search(anotherUsername));
        cy.with(Table)
            .with(TableRow, 'Username', `${anotherUsername}`)
            .find('.checkbox__checkbox')
            .click();

        cy.get('.action-bar')
            .with(ActionPicker)
            .do(ActionPicker.selectAction('Activate'));

        //validating the notification
        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'User bulk action successfully finished.');
    });

    it.skip('Reset password bulk users', () => {
        //create users in order to make reset bulk operation
        const userName = generate.userName();
        const anotherUsername = generate.userName();
        createRoleWithoutPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username: userName, password, roles: [role.id] }),
        );
        createRoleWithoutPermissions(['lock/unlock users', 'reset password', 'modify users']).then(role =>
            createActiveUser({ username: anotherUsername, password, roles: [role.id] }),
        );

        cy.reload(true);

        //select one user
        cy.with(Search).do(Search.search(userName));
        cy.with(Table)
            .with(TableRow, 'Username', `${userName}`)
            .find('.checkbox__checkbox')
            .click();

        //select another user
        cy.with(Search).do(Search.search(anotherUsername));
        cy.with(Table)
            .with(TableRow, 'Username', `${anotherUsername}`)
            .find('.checkbox__checkbox')
            .click();

        cy.get('.action-bar')
            .with(ActionPicker)
            .do(ActionPicker.selectAction('Force password reset'));

        //validating the notification
        cy.with(Notification)
            .do(Notification.getNotification())
            .should('be.equal', 'Force reset password successfully finished.');
    });
});
