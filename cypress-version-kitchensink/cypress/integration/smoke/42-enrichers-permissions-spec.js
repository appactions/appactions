import generate from '../../support/generate';
import apiConnect from '../../support/api/api-connect';
import { tempUserPassword } from '../../support/constants';
import { createActiveUser } from '../../support/api/users';
import { createRoleWithoutPermissions, deleteUserRole, updateUserRole } from '../../support/api/roles';

// skipped because cypress deadline
// This test requires Extensions to be installed in the AMI
// The AMIs used in the Nightly Builds do not have extensions installed, so this test always fails
describe.skip('Enrichers permissions', () => {
    const username = generate.userName();
    const password = tempUserPassword;
    let userRoleName = null;
    before(() => {
        createRoleWithoutPermissions(['modify enrichers']).then(role => {
            userRoleName = role.name;
            createActiveUser({ username, password, is_admin: false, roles: [role.id] });
        });
    });
    after(() => {
        deleteUserRole(userRoleName);
    });

    it('should not be able to enable or disable enricher', () => {
        cy.login(username, password)
            .clearWorkInProgress()
            .goto('/main/configuration/enrichment')
            .get('.top-nav__content')
            .getByTestId('not-loading')
            .should('be.visible');
        cy.get('.grid__item:eq(0) .card__subtitle')
            .find('label')
            .should('have.class', 'checkbox--disabled');
    });
    it('should not be able to edit enricher', () => {
        cy.login(username, password)
            .clearWorkInProgress()
            .goto('/main/configuration/enrichment')
            .get('.top-nav__content')
            .getByTestId('not-loading')
            .should('be.visible');
        cy.get('.grid__item:eq(0) .card__title')
            .click()
            .get('.detail-pane')
            .getByTestId('not-loading')
            .should('be.visible')
            .get('.detail-pane__content')
            .should('not.contain', 'Edit');
    });
    it('should not be able to see enrichers tab', () => {
        updateUserRole(userRoleName, ['modify enrichers', 'read enrichers']);

        cy.login(username, password)
            .clearWorkInProgress()
            .goto('/main/configuration')
            .get('.top-nav__content')
            .getByTestId('not-loading')
            .should('be.visible');
        cy.get('[data-test="top-nav-"] .top-nav__third-item-content').should('not.contain', 'Enrichers');
    });
});
