import generate from '../../support/generate';
import { cypressAdmin, tempUserPassword } from '../../support/constants';
import { createActiveUser } from '../../support/api/users';
import { createRoleWithoutPermissions, deleteUserRole, updateUserRole } from '../../support/api/roles';
import { createDraftEntity, createEntity } from '../../support/api/entities';
import { fetchSourceIdsByNames } from '../../support/api/sources';
import { createDataset } from '../../support/api/datasets';
import { createDiscoveryRule, deleteDiscoveryRule, runDiscoveryRule } from '../../support/api/discovery-rules';
import { createOutgoingFeed, runOutgoigFeed } from '../../support/api/outgoing-feeds';
import { FilterPanel, Table } from '../../support/testables';

describe('Filters & Columns permissions', () => {
    const username = generate.userName();
    let getRoleName;
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        fetchSourceIdsByNames(['Testing Group'])
            .then(id =>
                createEntity({
                    meta: {
                        made_with_builder: '1.10_1',

                        manual_extracts: [
                            {
                                kind: 'actor-id',
                                value: 'cypress-default-observable',
                                link_type: 'observed',
                                classification: 'bad',
                                confidence: 'low',
                            },
                        ],
                    },
                    sources: [
                        {
                            source_id: id[0],
                        },
                    ],
                }),
            )
            .its('body.data')
            .then(entity => createDataset({ entities: [entity.id] }))
            .its('body.data')
            .then(dataset => createOutgoingFeed({ intel_sets: [dataset.id] }))
            .its('body.data')
            .then(outgoingFeed => runOutgoigFeed(outgoingFeed.update_task))
            .wait(3000);
        createDraftEntity();
        createDiscoveryRule({
            name: `cypress-discovery-rule-${generate.randomNumber()}`,
            search_query: '*',
        }).then(rule => runDiscoveryRule(rule.id));
        createRoleWithoutPermissions([]).then(role => {
            getRoleName = role.name;
            createActiveUser({ username, tempUserPassword, roles: [role.id] });
        });
    });
    after(() => {
        deleteDiscoveryRule(getRoleName);
        deleteUserRole(getRoleName);
        cy.logout();
    });
    describe('Filters & Columns permissions with all permissions', () => {
        before(() => {
            cy.login(username, tempUserPassword);
        });
        it('should show roles and groups filters on User Management > Users page', () => {
            cy.visit('/user-management/users');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Roles')
                .should('be.visible');
            cy.with(FilterPanel)
                .contains('Groups')
                .should('be.visible');
        });
        it('should display `Source` filters on browse > entities page`', () => {
            cy.visit('/main/intel/all/browse');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('be.visible');
            cy.with(FilterPanel)
                .contains('Dataset')
                .should('be.visible');
        });
        it('should display `Source` filters on browse > observables page`', () => {
            cy.visit('/main/intel/all/browse/observable');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('be.visible');
        });
        it.skip('should display `Source` filters on production > published page`', () => {
            cy.visit('/main/intel/all/production/published');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('be.visible');
        });
        it('should display `Source` filters on production > draft page`', () => {
            cy.visit('/main/intel/all/production/draft');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Author')
                .should('be.visible');
        });
        it('should display `Source` & `Discovery rules` & `Dataset` filters on intelligence > discovery page`', () => {
            cy.visit('/main/intel/all/discovery');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('be.visible');
            cy.with(FilterPanel)
                .contains('Discovery rules')
                .should('be.visible');
            cy.with(FilterPanel)
                .contains('Dataset')
                .should('be.visible');
        });
        it('should display `Dataset` filter on intelligence > Exposure > Entities page`', () => {
            cy.visit('/main/intel/all/exposure/list');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Dataset')
                .should('be.visible');
        });
        it('should display `Users` and `Sources` column on groups page', () => {
            cy.visit('/user-management/groups');
            const tableColumns = () => cy.with(Table).do(Table.getColumnLabels());
            tableColumns().should('contain', 'Users');
            tableColumns().should('contain', 'Sources');
        });
        it('should display `Source` column on browser entities page', () => {
            cy.visit('/main/intel/all/browse');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Source');
        });
        it('should display `Source` column on observables page', () => {
            cy.visit('/main/intel/all/browse/observable');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Source');
        });
        it('should display `Sources` column Production > Published page', () => {
            cy.visit('/main/intel/all/production/published');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Source');
        });
        it('should display `Sources` column on Production > Observables page', () => {
            cy.visit('/main/intel/all/production/observables');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Source');
        });
        it('should display `Sources` & `Rules` column on Ingelligence Discovery page', () => {
            cy.visit('/main/intel/all/discovery');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Source')
                .should('contain', 'Rule');
        });
        it('should display `Related objects` & `Triggered by` columns on system jobs screens', () => {
            cy.visit('/system-jobs');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Related objects')
                .should('contain', 'Triggered by');
            cy.visit('/system-jobs?status%5B%5D=SENT%2CSTARTED');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Related objects')
                .should('contain', 'Triggered by');
            cy.visit('/system-jobs?status%5B%5D=SUCCESS');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Related objects')
                .should('contain', 'Triggered by');
            cy.visit('/system-jobs?status%5B%5D=FAILURE');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Related objects')
                .should('contain', 'Triggered by');
            cy.visit('/system-jobs?status%5B%5D=REVOKED');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('contain', 'Related objects')
                .should('contain', 'Triggered by');
        });
    });

    describe('Filters & Columns permissions without corresponding permissions', () => {
        before(() => {
            updateUserRole(getRoleName, [
                'read roles',
                'modify roles',
                'modify groups',
                'read groups',
                'read sources',
                'modify discovery-rules',
                'read discovery-rules',
                'read intel-sets',
                'modify intel-sets',
            ]);
            cy.login(username, tempUserPassword);
            cy.clearWorkInProgress();
        });
        it.skip('should not display `Source` filters on browse > entities page`', () => {
            cy.visit('/main/intel/all/browse');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('not.be.visible');
            cy.with(FilterPanel)
                .contains('Dataset')
                .should('not.be.visible');
        });
        it.skip('should not display `Source` filters on browse > observables page`', () => {
            cy.visit('/main/intel/all/browse/observable');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('not.be.visible');
            cy.with(FilterPanel)
                .contains('Destinations')
                .should('not.be.visible');
        });
        it.skip('should not display `Source` filters on production > published page`', () => {
            cy.visit('/main/intel/all/production/published');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('not.be.visible');
            cy.with(FilterPanel)
                .contains('Dataset')
                .should('not.be.visible');
        });
        it.skip('should not display `Source` filters on production > draft page`', () => {
            cy.visit('/main/intel/all/production/draft');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('not.be.visible');
        });
        it.skip('should not display `Source` & `Discovery rules` & `Dataset` filters on intelligence > discovery page`', () => {
            cy.visit('/main/intel/all/discovery');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Source')
                .should('not.be.visible');
            cy.with(FilterPanel)
                .contains('Discovery rules')
                .should('not.be.visible');
            cy.with(FilterPanel)
                .contains('Dataset')
                .should('not.be.visible');
        });
        it.skip('should not display `Dataset` filter on intelligence > Exposure > Entities page`', () => {
            cy.visit('/main/intel/all/exposure/list');
            cy.getByTestId('header-filter').click();
            cy.get('.filter').should('be.visible');
            cy.with(FilterPanel)
                .contains('Dataset')
                .should('not.be.visible');
        });
        it('should not display `Users` and `Sources` column on users page', () => {
            cy.visit('/user-management/users');
            const tableColumns = () => cy.with(Table).do(Table.getColumnLabels());
            tableColumns().should('not.contain', 'Users');
            tableColumns().should('not.contain', 'Sources');
        });
        it('should not display Groups & Roles pages', () => {
            cy.visit('/user-management');
            const tableColumns = () => cy.with(Table).do(Table.getColumnLabels());
            tableColumns().should('not.contain', 'Groups');
            tableColumns().should('not.contain', 'Roles');
        });
        it('should not display `Source` column on browser entities page', () => {
            cy.visit('/main/intel/all/browse');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('not.contain', 'Source');
        });
        it('should not display `Source` column on observables page', () => {
            cy.visit('/main/intel/all/browse/observable');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('not.contain', 'Source');
        });
        it('should not display `Sources` column Production > Published page', () => {
            cy.visit('/main/intel/all/production/published');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('not.contain', 'Source');
        });
        it('should not display `Sources` column on Production > Observables page', () => {
            cy.visit('/main/intel/all/production/observables');
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('not.contain', 'Source');
        });
        it('should not display `Sources` & `Rules` column on Ingelligence Discovery page', () => {
            cy.visit('/main/intel/all/discovery');
            const tableColumns = () => cy.with(Table).do(Table.getColumnLabels());
            tableColumns().should('not.contain', 'Source');
            tableColumns().should('not.contain', 'Rule');
        });
        it('should not display `Users` and `Sources` column on groups page', () => {
            updateUserRole(getRoleName, ['read users', 'modify users', 'read sources']);

            cy.login(username, tempUserPassword);
            cy.clearWorkInProgress();
            cy.visit('/user-management/groups');
            const tableColumns = () => cy.with(Table).do(Table.getColumnLabels());
            tableColumns().should('not.contain', 'Users');
            tableColumns().should('not.contain', 'Sources');
        });
        it('should not display `Related objects` & `Triggered by` columns on system jobs screens', () => {
            updateUserRole(getRoleName, [
                'read users',
                'modify users',
                'read entities',
                'modify entities',
                'read extracts',
                'modify extracts',
                'read incoming-feeds',
                'modify incoming-feeds',
                'modify incoming-feeds',
                'read outgoing-feeds',
                'modify outgoing-feeds',
                'read rules',
                'modify rules',
                'read discovery-rules',
                'modify discovery-rules',
                'read enrichment-rules',
                'modify enrichment-rules',
                'read retention-policies',
                'modify retention-policies',
            ]);
            cy.login(username, tempUserPassword);
            cy.clearWorkInProgress();
            cy.visit('/system-jobs');
            cy.with(Table)
                .do(Table.getColumn('Related objects.0'))
                .should('deep.equal', []);
            cy.with(Table)
                .do(Table.getColumnLabels())
                .should('not.contain', 'Triggered by');
        });
    });
});
