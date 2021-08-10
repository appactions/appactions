import { cypressAdmin, tempUserPassword } from '../../support/constants';
import { createEntity } from '../../support/api/entities';
import apiConnect from '../../support/api/api-connect';
import { createActiveUser, createUserWithoutPermissions } from '../../support/api/users';
import faker from 'faker';
import generate from '../../support/generate';
import { Clickable, DetailPane, Table, TableRow, ListHeader } from '../../support/high-level-api/testables';
import { createDiscoveryRule } from '../../support/api/discovery-rules';

describe('User management', () => {
    describe('Roles and Permissions', () => {
        describe('History-events and audit-trail permission', () => {
            const ruleName = `Rule ${faker.random.number()}`;

            before(() => {
                cy.login(cypressAdmin.username, cypressAdmin.password);
                const api = apiConnect();

                // make sure there are some discovery results: create an entity, create a rule, run the rule
                createActiveUser()
                    .then(user => api.get(`groups/${user.groups[0]}`))
                    .its('body.data')
                    .then(group =>
                        createEntity({
                            sources: [
                                {
                                    source_id: group.source,
                                },
                            ],
                        }),
                    )
                    .its('body.data')
                    .then(entity =>
                        api.post('discovery-tasks/', {
                            name: `${faker.hacker.noun()}_${faker.random.number()}`,
                            search_query: entity.data.title,
                            parameters: {},
                            is_active: true,
                            correlated_workspaces: [],
                            correlated_workspace_types: [],
                        }),
                    )
                    .its('body.data')
                    .then(task => api.post(`tasks/${task.id}/run`, { id: task.id }));

                cy.wait(3000); // wait until the task is done - don't know how to poll...

                createDiscoveryRule({ name: ruleName, search: 'data.type:indicator' });
            });

            describe('With modify discovery-rules, with modify tasks permissions', () => {
                const username = generate.userName();

                before(() => {
                    // create a user which has all the permissions
                    const withoutPermissions = [];
                    createUserWithoutPermissions({ username, tempUserPassword }, withoutPermissions);
                    cy.login(username, tempUserPassword);
                });

                it('Data Configuration -> Rules: should show Discovery tab and the list of discovery rules there, user can create and edit rule', () => {
                    cy.goto('/main/configuration/rules/extract-rules');
                    cy.with(Table);
                    cy.getByTestId('tab-item')
                        .contains('Discovery')
                        .click();

                    cy.contains('.data-table__th', 'Rule name').should('be.visible');
                    cy.contains('.data-table__th', 'Description').should('be.visible');
                    cy.contains('.data-table__th', 'Search query').should('be.visible');
                    cy.contains('.data-table__th', 'Enabled').should('be.visible');
                    cy.contains('.data-table__th', 'Last run').should('be.visible');
                    cy.contains('.data-table__th', 'Last changed').should('be.visible');

                    cy.contains(ruleName)
                        .parent()
                        .find('.data-table__td--type-actions')
                        .click();
                    cy.getByTestId('dropdown-option-edit').should('be.visible');
                    cy.getByTestId('dropdown-option-delete').should('be.visible');
                    cy.getByTestId('dropdown-option-enable').should('be.visible');
                    cy.getByTestId('dropdown-option-disable').should('be.visible');

                    // open the detail pane
                    cy.with(Table)
                        .with(TableRow, 'Rule name', ruleName)
                        .click();
                    cy.with(DetailPane)
                        .contains('Enable')
                        .should('be.visible');
                    cy.with(DetailPane)
                        .contains('Disable')
                        .should('be.visible');
                    cy.with(DetailPane)
                        .with(Clickable, 'Run Now')
                        .click();

                    cy.with(DetailPane)
                        .find('.dropdown--style-dots')
                        .click();
                    cy.getByTestId('dropdown-option-enable').should('be.visible');
                    cy.getByTestId('dropdown-option-disable').should('be.visible');
                    cy.getByTestId('dropdown-option-edit').should('be.visible');
                    cy.getByTestId('dropdown-option-delete').should('be.visible');

                    cy.with(DetailPane).do(DetailPane.close());
                });

                it('Intelligence → Discovery: should show pencil icon for “Discovery Rules” and “Discovery Rules” filter, Rules column in the entities list; ', () => {
                    cy.goto('/main/intel/all/discovery');
                    cy.with(Table);
                    cy.getByTestId('table-header-meta.discovery.rules.name').should('be.visible');
                    cy.getByTestId('header-filter').click();
                    cy.with(ListHeader).do(ListHeader.activateActionByTitle('Discovery rules'));

                    cy.url().should('include', '/main/configuration/rules/discovery');
                });
            });

            describe('Without modify discovery-rules, with modify tasks permissions', () => {
                const username = generate.userName();

                before(() => {
                    // create a user which has all the permissions, except modify discovery-rule
                    const withoutPermissions = ['modify discovery-rules'];
                    createUserWithoutPermissions({ username, tempUserPassword }, withoutPermissions);
                    cy.login(username, tempUserPassword);
                });

                it('Data Configuration -> Rules: should show Discovery tab and the list of discovery rules there', () => {
                    cy.goto('/main/configuration/rules/extract-rules');
                    cy.with(Table);
                    cy.getByTestId('tab-item')
                        .contains('Discovery')
                        .click();

                    cy.getByTestId('list-header-action-create-rule').should('not.exist');
                    cy.contains('.data-table__th', 'Rule name').should('be.visible');
                    cy.contains('.data-table__th', 'Description').should('be.visible');
                    cy.contains('.data-table__th', 'Search query').should('be.visible');
                    cy.contains('.data-table__th', 'Enabled').should('be.visible');
                    cy.contains('.data-table__th', 'Last run').should('be.visible');
                    cy.contains('.data-table__th', 'Last changed').should('be.visible');

                    cy.contains('.data-table__td', ruleName)
                        .parent()
                        .find('.data-table__td--type-actions')
                        .click();
                    cy.getByTestId('dropdown-option-edit').should('not.exist');
                    cy.getByTestId('dropdown-option-delete').should('not.exist');
                    //todo: uncomment below strings after bug fix: tp43176
                    /*cy.getByTestId('dropdown-option-enable').should('not.exist');
                    cy.getByTestId('dropdown-option-disable').should('not.exist');*/

                    // open the detail pane

                    cy.with(Table)
                        .with(TableRow, 'Rule name', ruleName)
                        .click();
                    cy.with(DetailPane)
                        .contains('Enabled')
                        .should('not.exist');
                    cy.with(DetailPane)
                        .contains('Disable')
                        .should('not.exist');

                    cy.with(DetailPane)
                        .find('.dropdown--style-dots')
                        .click();
                    cy.getByTestId('dropdown-option-edit').should('not.exist');
                    cy.getByTestId('dropdown-option-delete').should('not.exist');
                    //todo: uncomment below strings after bug fix: tp43176
                    /*cy.getByTestId('dropdown-option-enable').should('not.exist');
                    cy.getByTestId('dropdown-option-disable').should('not.exist');*/

                    cy.with(DetailPane).do(DetailPane.close());
                });

                it('Intelligence → Discovery -> Rules: should show pencil icon for “Discovery Rules” and “Discovery Rules” filter, Rules column in the entities list; ', () => {
                    cy.goto('/main/intel/all/discovery');
                    cy.with(ListHeader).do(ListHeader.activateActionByTitle('Discovery rules'));
                    cy.url().should('include', '/main/configuration/rules/discovery');
                });
            });

            describe('With modify discovery-rules, without modify tasks permissions', () => {
                const username = generate.userName();

                before(() => {
                    // create a user which has all the permissions, except modify discovery-rule
                    const withoutPermissions = ['modify tasks'];
                    createUserWithoutPermissions({ username, tempUserPassword }, withoutPermissions);
                    cy.login(username, tempUserPassword);
                });

                it('Data Configuration -> Rules: should not allow to enable/disable or run rules', () => {
                    cy.goto('/main/configuration/rules/extract-rules');
                    cy.with(Table);
                    cy.getByTestId('tab-item')
                        .contains('Discovery')
                        .click();
                    cy.contains(ruleName)
                        .parent()
                        .find('.data-table__td--type-actions')
                        .click();
                    cy.getByTestId('dropdown-option-edit').should('exist');
                    cy.getByTestId('dropdown-option-delete').should('exist');
                    //todo: uncomment below strings after bug fix tp43176
                    //cy.getByTestId('dropdown-option-run-now').should('not.exist');
                    //cy.getByTestId('dropdown-option-enable').should('not.exist');
                    //cy.getByTestId('dropdown-option-disable').should('not.exist');

                    // open the detail pane
                    cy.with(Table)
                        .with(TableRow, 'Rule name', ruleName)
                        .click();
                    cy.with(DetailPane)
                        .contains('Enabled')
                        .should('not.exist');
                    cy.with(DetailPane)
                        .contains('Disable')
                        .should('not.exist');

                    cy.with(DetailPane)
                        .find('.dropdown--style-dots')
                        .click();
                    cy.getByTestId('dropdown-option-edit').should('exist');
                    cy.getByTestId('dropdown-option-delete').should('exist');
                    //todo: uncomment below strings after bug fix tp43176
                    //cy.getByTestId('dropdown-option-run-now').should('not.exist');
                    //cy.getByTestId('dropdown-option-enable').should('not.exist');
                    //cy.getByTestId('dropdown-option-disable').should('not.exist');

                    cy.with(DetailPane).do(DetailPane.close());
                });
            });

            describe('Without modify discovery-rules, without modify tasks permissions', () => {
                const username = generate.userName();
                before(() => {
                    // create a user which has all the permissions, except modify discovery-rule
                    const withoutPermissions = ['modify discovery-rules', 'modify tasks'];
                    createUserWithoutPermissions({ username, tempUserPassword }, withoutPermissions);
                    cy.login(username, tempUserPassword);
                });

                it('Data Configuration -> Rules: should not show the action picker', () => {
                    cy.goto('/main/configuration/rules/extract-rules');
                    cy.with(Table);
                    cy.getByTestId('tab-item')
                        .contains('Discovery')
                        .click();

                    cy.contains(ruleName)
                        .parent()
                        .find('.data-table__td--type-actions')
                        .click();
                    cy.getByTestId('dropdown-option-edit').should('not.exist');
                    cy.getByTestId('dropdown-option-delete').should('not.exist');
                    cy.getByTestId('dropdown-option-run-now').should('not.exist');
                    cy.getByTestId('dropdown-option-enable').should('not.exist');
                    cy.getByTestId('dropdown-option-disable').should('not.exist');

                    // open the detail pane
                    cy.with(Table)
                        .with(TableRow, 'Rule name', ruleName)
                        .click();
                    cy.with(DetailPane)
                        .contains('Enabled')
                        .should('not.exist');
                    cy.with(DetailPane)
                        .contains('Disable')
                        .should('not.exist');

                    cy.with(DetailPane)
                        .find('.dropdown--style-dots')
                        .should('not.exist');

                    cy.with(DetailPane).do(DetailPane.close());
                });
            });

            describe('Without read discovery-rules permissions', () => {
                const username = generate.userName();

                before(() => {
                    // create a user which has all the permissions, except modify discovery-rules and read discovery-rules
                    const withoutPermissions = ['modify discovery-rules', 'read discovery-rules'];
                    createUserWithoutPermissions({ username, tempUserPassword }, withoutPermissions);
                    cy.login(username, tempUserPassword);
                });

                it('Data Configuration -> Rules: should not show Discovery tab and the list of discovery rules there', () => {
                    cy.goto('/main/configuration/rules/extract-rules');
                    cy.with(Table);
                    cy.getByTestId('tab-item')
                        .contains('Discovery')
                        .should('not.exist');
                });

                it('Intelligence → Discovery -> Rules: should not show pencil icon for “Discovery Rules” and “Discovery Rules” filter, Rules column in the entities list; ', () => {
                    cy.goto('/main/intel/all/discovery');
                    cy.with(Table);
                    cy.getByTestId('list-header-action-discovery-rules').should('not.exist');
                    cy.getByTestId('table-header-meta.discovery.rules.name').should('not.exist');
                    cy.getByTestId('header-filter').click();
                    cy.getByTestId('Discovery rules').should('not.exist');
                });
            });
        });
    });
});
