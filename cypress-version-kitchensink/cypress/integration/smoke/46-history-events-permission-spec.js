import { tempUserPassword } from '../../support/constants';
import apiConnect from '../../support/api/api-connect';
import { createUserWithoutPermissions } from '../../support/api/users';
import faker from 'faker';
import generate from '../../support/generate';
import { Collapsible, DetailPane, Form, Section, Table, TableRow } from '../../support/high-level-api/testables';
import { createEntity } from '../../support/api/entities';
import { fetchSourceIdsByNames } from '../../support/api/sources';

describe('User management', () => {
    describe('Roles and Permissions', () => {
        describe('History-events and audit-trail permission', () => {
            const password = tempUserPassword;
            const ruleName = `Rule ${faker.random.number()}`;

            before(() => {
                const api = apiConnect();
                // make sure there are items in the api that we can check the history tab for
                api.post('entity-rules/', {
                    name: ruleName,
                    active: false,
                    entity_types: ['ttp'],
                    actions: ['tag'],
                    taxonomy: [21],
                });
                api.post('extract-rules/', {
                    name: ruleName,
                    active: false,
                    entity_types: ['ttp'],
                    action: 'ignore',
                    action_details: { classification: 'unknown' },
                });
                api.post('discovery-tasks/', {
                    name: ruleName,
                    search_query: 'data:ttp',
                    parameters: {},
                    is_active: false,
                });
            });

            // after(() => {
            //     cy.logout();
            // });

            describe('Without history-events permission', () => {
                const username = generate.userName();

                before(() => {
                    fetchSourceIdsByNames(['Testing Group']).then(([sourceId]) => {
                        createEntity({ type: 'indicator', sources: [{ source_id: sourceId }] });
                    });

                    // create a user which has all the permissions, except history events
                    const withoutPermissions = ['read history-events'];
                    createUserWithoutPermissions({ username, password }, withoutPermissions);
                    cy.login(username, password);
                });

                it.only('user management: should not show history tab when the user does not have the history-events permission', () => {
                    //check user detail pane
                    cy.visit('/user-management/users');
                    cy.getByTestId('search-input')
                        .click()
                        .clear()
                        .type(username)
                        .type('{enter}');
                    cy.get('.data-table--type-normal .data-table__td--main')
                        .contains(username)
                        .click();
                    cy.get('.detail-pane')
                        .contains('[data-test="tab-item"]', 'History')
                        .should('not.exist');
                    cy.with(DetailPane).do(DetailPane.close());

                    // check group detail pane
                    cy.visit('/user-management/groups');
                    shouldNotHaveHistoryTabForFirstItemGroup();

                    // check roles detail pane
                    cy.visit('/user-management/roles');
                    shouldNotHaveHistoryTabForFirstItem();
                });

                it('incoming feeds: should not show history tab when the user does not have the history-events permission', () => {
                    // note: this assumes there is at least one incoming feed configured
                    cy.visit('main/configuration/incoming-feeds');
                    // wait for the table to render
                    cy.get('.data-table--type-normal');

                    openDetailPaneForFirstItem();
                    cy.get('.detail-pane [data-test="tab-item"]')
                        .contains('Editing History')
                        .should('not.exist');
                    cy.with(DetailPane).do(DetailPane.close());
                });

                it('outgoing feeds: should not show history tab when the user does not have the history-events permission', () => {
                    // note: this assumes there is at least one outgoing feed configured
                    cy.visit('main/configuration/outgoing-feeds');
                    // wait for the table to render
                    cy.get('.data-table--type-normal');

                    openDetailPaneForFirstItem();
                    cy.get('.detail-pane [data-test="tab-item"]')
                        .contains('Editing History')
                        .should('not.exist');
                    cy.with(DetailPane).do(DetailPane.close());
                });

                it('rules: should not show history tab when the user does not have the history-events permission', () => {
                    cy.visit('main/configuration/rules/extract-rules');
                    shouldNotHaveHistoryTabForFirstItem();

                    cy.visit('main/configuration/rules/entity-rules');
                    shouldNotHaveHistoryTabForFirstItem();

                    cy.visit('main/configuration/rules/discovery');
                    shouldNotHaveHistoryTabForFirstItem();
                });

                it('policies: should not show history tab when the user does not have the history-events permission', () => {
                    cy.visit('/main/configuration/retention-policies');
                    cy.getByTestId('list-header-action-create-retention-policy').click();
                    cy.waitPageForLoad();

                    cy.with(Form).do(
                        Form.fill({
                            Name: ruleName,
                        }),
                    );
                    // filling in schedule
                    cy.get('[data-test="execution_schedule"]')
                        .parent()
                        .selectChoose('Every [n] day');

                    // fill in an harmless retention period form
                    cy.get('.input[name="retention_period[period]"]').type('100');
                    cy.get('[data-test="retention_period[unit]"]').selectChoose('Years');
                    cy.get('[data-test="retention_period[field]"]').selectChoose('Ingestion');

                    // filling in source criterion
                    cy.get('[data-test="sourceCriterionForm"]').selectChoose('Select all options');

                    // filling in ttp entity type for "Delete entities" action
                    cy.with(Section, 'Actions')
                        .with(Collapsible)
                        .do(
                            Collapsible.fill({
                                'Entity types': ['TTP'],
                            }),
                        );
                    cy.getByTestId('save').click();

                    shouldNotHaveHistoryTabForFirstItem();
                });

                it('intelligence: should not show history tab when the user has history-events permission', () => {
                    // note: this assumes there is at least one entity in the platform
                    cy.visit('/main/intel/all');
                    cy.getByTestId('top-nav-link-browse').click();
                    shouldNotHaveHistoryTabForFirstTableItem();

                    cy.visit('/main/intel/all/workspaces/');
                    cy.getByTestId('card')
                        .contains('Default public workspace')
                        .click();
                    cy.getByTestId('top-nav-link-workspace-audit').should('not.exist');
                });
            });

            describe('With history-events permission', () => {
                const username = generate.userName();

                before(() => {
                    fetchSourceIdsByNames(['Testing Group']).then(([sourceId]) => {
                        createEntity({ type: 'indicator', sources: [{ source_id: sourceId }] });
                    });
                    // create a user which has all the permissions, except history events
                    createUserWithoutPermissions({ username, password });
                    cy.login(username, password);
                });

                it('user management: should show history tab when the user has history-events permission', () => {
                    //check user detail pane
                    cy.visit('/user-management/users');
                    cy.getByTestId('top-nav-link-users').click();
                    cy.getByTestId('search-input')
                        .click()
                        .clear()
                        .type(username)
                        .type('{enter}');
                    cy.get('.data-table__table .data-table__td--main')
                        .contains(username)
                        .click();
                    cy.get('[data-test="tab-item"]')
                        .contains('History')
                        .should('be.visible');
                    cy.with(DetailPane).do(DetailPane.close());

                    //check group detail pane
                    cy.visit('/user-management/groups');
                    shouldHaveHistoryTabForFirstItemGroup();

                    //check roles detail pane
                    cy.visit('/user-management/roles');
                    shouldHaveHistoryTabForFirstItem();
                });

                it('incoming feeds: should show history tab when the user has history-events permission', () => {
                    //Incoming feed
                    cy.visit('main/configuration/incoming-feeds');
                    // wait for the table to render
                    cy.get('.data-table--type-normal');

                    openDetailPaneForFirstItem();
                    cy.get('[data-test="tab-item"]')
                        .contains('Editing History')
                        .should('be.visible');
                    cy.wait(500);
                    cy.with(DetailPane).do(DetailPane.close());
                });

                it('outgoing feeds: should show history tab when the user has history-events permission', () => {
                    //Outgoing feed

                    cy.visit('main/configuration/outgoing-feeds');
                    // wait for the table to render
                    cy.get('.data-table--type-normal');

                    openDetailPaneForFirstItem();
                    cy.get('[data-test="tab-item"]')
                        .contains('Editing History')
                        .should('be.visible');
                    cy.with(DetailPane).do(DetailPane.close());
                });

                it('rules: should show history tab when the user has history-events permission', () => {
                    cy.goto('/main/configuration/rules/extract-rules');
                    shouldHaveHistoryTabForFirstItem();

                    cy.goto('/main/configuration/rules/entity-rules');
                    shouldHaveHistoryTabForFirstItem();

                    cy.goto('/main/configuration/rules/discovery');
                    shouldHaveHistoryTabForFirstItem();

                    //Policies
                    cy.goto('/main/configuration/retention-policies');
                    shouldHaveHistoryTabForFirstItem();
                });

                it('intelligence: should show history tab when the user has history-events permission', () => {
                    cy.visit('/main/intel/all');
                    cy.getByTestId('top-nav-link-browse').click();
                    shouldHaveHistoryTabForFirstTableItem();

                    cy.visit('main/intel/all/exposure');
                    shouldHaveHistoryTabForFirstTableItem();

                    cy.visit('/main/intel/all/workspaces/');
                    cy.getByTestId('card')
                        .contains('Default public workspace')
                        .click();
                    cy.getByTestId('top-nav-link-workspace-audit').should('be.visible');
                });
            });

            describe('Audit trail permission', () => {
                const username = generate.userName();

                before(() => {
                    // create a user which has all the permissions, except history events
                    createUserWithoutPermissions(
                        {
                            username,
                            password,
                        },
                        ['read audit-trail'],
                    );
                    cy.login(username, password);
                });

                after(() => {});

                it('should only show audit trail for users with read audit-trail permission', () => {
                    cy.visit('system-settings/general');
                    cy.getByTestId('top-nav-link-audit').should('not.exist');
                });
            });
        });
    });
});

function openDetailPaneForFirstItem() {
    cy.with(Table)
        .with(TableRow, (_, index) => index === 1)
        .click();
    // wait for it to load
    cy.with(DetailPane);
}

function openDetailPaneForFirstItemGroup() {
    cy.with(Table)
        .with(TableRow, (_, index) => index === 1)
        .click();
    // wait for it to load
    cy.with(DetailPane);
}

function shouldNotHaveHistoryTabForFirstItem() {
    // wait for the table to render
    cy.with(Table);
    openDetailPaneForFirstItem();
    cy.get('.detail-pane')
        .contains('[data-test="tab-item"]', 'History')
        .should('not.exist');
    cy.wait(500);
    cy.closeDetailPaneIfOpen();
}

function shouldNotHaveHistoryTabForFirstItemGroup() {
    // wait for the table to render
    cy.with(Table);
    openDetailPaneForFirstItemGroup();
    cy.get('.detail-pane')
        .contains('[data-test="tab-item"]', 'History')
        .should('not.exist');
    cy.wait(500);
    cy.closeDetailPaneIfOpen();
}

function shouldNotHaveHistoryTabForFirstTableItem() {
    // wait for the table to render
    cy.with(Table);
    openDetailPaneForFirstItem();
    cy.get('.detail-pane')
        .contains('[data-test="tab-item"]', 'HISTORY')
        .should('not.exist');
    cy.wait(500);
    cy.closeDetailPaneIfOpen();
}

function shouldHaveHistoryTabForFirstItem() {
    // wait for the table to render
    cy.with(Table);
    openDetailPaneForFirstItem();
    cy.get('.detail-pane')
        .contains('[data-test="tab-item"]', 'History')
        .should('exist');
    cy.wait(500);
    cy.closeDetailPaneIfOpen();
}

function shouldHaveHistoryTabForFirstItemGroup() {
    // wait for the table to render
    cy.with(Table);
    openDetailPaneForFirstItemGroup();
    cy.get('.detail-pane')
        .contains('[data-test="tab-item"]', 'History')
        .should('exist');
    cy.wait(500);
    cy.closeDetailPaneIfOpen();
}

function shouldHaveHistoryTabForFirstTableItem() {
    // wait for the table to render
    cy.with(Table);
    openDetailPaneForFirstItem();
    cy.get('.detail-pane')
        .contains('[data-test="tab-item"]', 'HISTORY')
        .should('exist');
    cy.wait(500);
    cy.closeDetailPaneIfOpen();
}
