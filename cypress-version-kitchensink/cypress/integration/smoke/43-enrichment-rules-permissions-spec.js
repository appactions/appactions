import generate from '../../support/generate';
import '../../support/commands';
import apiConnect from '../../support/api/api-connect';
import { tempUserPassword } from '../../support/constants';
import { createUserWithoutPermissions } from '../../support/api/users';
import { createEnrichmentRule, deleteEnrichmentRule } from '../../support/api/enrichment-rules';
import { DetailPane, Table, TableRow } from '../../support/high-level-api/testables';
import faker from 'faker';

// skipped because cypress deadline
// This test requires Extensions to be installed in the AMI
// The AMIs used in the Nightly Builds do not have extensions installed, so this test always fails
describe.skip('Enrichment Rules', () => {
    describe('Enrichment read rules permissions', () => {
        const getRuleName = `cypress_name_${faker.random.word()}_${faker.random.number()}`;
        before(() => {
            const password = tempUserPassword;
            const username = generate.userName();
            // creates a new user with a new role with a excluded permission 'modify enrichment-rules'
            createUserWithoutPermissions({ username, password, is_admin: false }, ['modify enrichment-rules']);
            // creates a new user with a new role with a excluded permission 'read enrichment-rules'
            createEnrichmentRule(getRuleName, ['Censys Enricher']);
            // logs in with newly created user
            cy.login(username, password);
        });

        beforeEach(() => {
            cy.goto('/main/configuration/rules/enrichment');
        });

        after(() => {
            deleteEnrichmentRule(getRuleName);
        });
        it('should not allow creating, modifying and delete enrichment rules', () => {
            // checks if the actions are not available
            cy.with(Table)
                .with(TableRow, 'Rule name', getRuleName)
                .find('[data-test="dropdown-wrapper"]')
                .should('not.exist');
            cy.with(Table)
                .with(TableRow, 'Rule name', getRuleName)
                .click();

            cy.with(DetailPane)
                .find('[data-test="dropdown-wrapper"]')
                .should('not.exist');

            cy.with(DetailPane).do(DetailPane.close());

            cy.getByTestId('list-header-action-create-rule').should('not.exist');

            cy.getByTestId('nav-panel-item')

                .find('.icon-plus')
                .trigger('mouseover');

            cy.getByTestId('dropdown-option-enrichment-rule').should('not.exist');
        });
    });

    describe('Enrichment modify rules permissions', () => {
        const getRuleName = `cypress_name_${faker.random.word()}_${faker.random.number()}`;
        before(() => {
            const password = tempUserPassword;
            const username = generate.userName();
            createEnrichmentRule(getRuleName, ['Censys Enricher']);
            // creates a new user with a new role with a excluded permission read taxii-services'
            createUserWithoutPermissions({ username, password, is_admin: false }, ['read enrichment-rules']);
            // logs in with newly created user
            cy.login(username, password);
        });

        beforeEach(() => {
            cy.goto('/main/configuration/rules/enrichment');
        });

        after(() => {
            deleteEnrichmentRule(getRuleName);
        });

        it('should make plus button (add new) available for opening enrichment rule creation form', () => {
            // checks that plus button (add new) is available
            cy.getByTestId('list-header-action-create-rule').should('be.visible');
            // opens enrichment rule creation form
            cy.getByTestId('list-header-action-create-rule').click();
            // checks that creation form is open
            cy.contains('Create enrichment rule');
        });

        it('should be able to open edit enrichment rule', () => {
            // opens edit form of enrichment rule from a data table
            cy.getTableRowForContent(getRuleName)
                .find('[data-test="dropdown-wrapper"]')
                .click();
            cy.getByTestId('dropdown-option-edit').click();
            // checks that edition form is open
            cy.contains('Edit enrichment rule');
        });
    });
});
