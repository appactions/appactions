import { createUserWithoutPermissions } from '../../support/api/users';
import generate from '../../support/generate';
import { createGroup } from '../../support/groups/helper';
import { DetailPane, Form, Table, TableRow } from '../../support/high-level-api/testables';
import { tempUserPassword } from '../../support/constants';
import apiConnect from '../../support/api/api-connect';
import { updateUserRole } from '../../support/api/roles';

// test scope: user without [modify groups] permission shall not be able to edit any group.
// as well user can read:add:remove any source group with his allowed sources through the group he belongs to

describe('group sources', () => {
    let groupName, groupId;
    let nonAdminUserId;
    let roleId;
    const username = generate.userName();
    const password = tempUserPassword;

    before(() => {
        // create first group
        createUserWithoutPermissions(
            {
                username: username,
                password: password,
            },
            ['modify groups'],
        ).then(data => {
            roleId = data.roles;
            nonAdminUserId = data.id;
            // create a group with some random sources
            createGroup().then(data => {
                groupName = data.name;
                groupId = data.id;
                cy.addSourceToGroup(groupId, groupName);
                cy.addUsersToGroup(groupId, nonAdminUserId);
            });
        });
        cy.login(username, password);
    });
    after(() => {
        cy.logout();
    });

    it('user should not be able to edit group if user has not "modify-groups" permission assigned', () => {
        cy.visit('/user-management/groups?&order=desc&sort=created_at');
        // confirm there is no Edit option from list page in line dot actions;
        cy.with(Table)
            .with(TableRow, 'Group name', groupName)
            .find('.data-table__td--type-actions .dropdown--style-dots')
            .should('not.exist');

        // confirm there is no Edit option from DetailPane;
        cy.with(Table)
            .with(TableRow, 'Group name', groupName)
            .click();
        cy.with(DetailPane)
            .find('.detail-pane__header-bar .dropdown--style-dots')
            .should('not.exist');
        cy.with(DetailPane).do(DetailPane.close());
    });

    it('user could assign sources only related to him through groups', () => {
        // user shall have 4 allowed sources through group he belongs to
        let userAllowedSources;

        // add ['modify groups'] permission to the user's role
        apiConnect()
            .get(`roles/${roleId[0]}`)
            .its('body.data')
            .then(role => {
                updateUserRole(role.name, []);
            });

        // fetch the sources user has access
        apiConnect({ username, password })
            .get('sources/me')
            .its('body.data')
            .then(sourceNames => {
                userAllowedSources = [...new Set(sourceNames.map(sourceName => sourceName.name))];
            });

        cy.visit('/user-management/groups?&order=desc&sort=created_at');
        cy.with(Table)
            .with(TableRow, 'Group name', groupName)
            .do(TableRow.selectAction('Edit'));

        cy.with(Form)
            .find('[data-field-path="allowed_sources"] input[name$="[source]"]')
            .each($input => {
                if ($input.is(':disabled')) {
                    return;
                }

                cy.wrap($input)
                    .parent()
                    .first()
                    .click();

                for (let i = 0; i < userAllowedSources.length; i++) {
                    cy.get('.Select-menu-outer').should('contain', userAllowedSources[i]);
                }

                // close the select menu
                cy.get('body').click();
            });
    });
});
