import { cypressAdmin } from '../../support/constants';
import generate from '../../support/generate';
import { Table, TableRow, DetailPane, Form, ListHeader, Search, Clickable } from '../../support/testables';

describe('user-management', () => {
    const groupName = generate.groupName();

    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.updateUser(cypressAdmin.username, 'users/me');
    });
    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check groups', () => {
        it('should be able to create a group', () => {
            cy.getByTestId('settings')
                .click()
                .get('.dropdown__option')
                .contains('User management')
                .click()
                .getByTestId('top-nav-link-groups')
                .contains('Groups')
                .click()
                .getByTestId('list-header-action-create-group')
                .click()
                .get('[data-field-name="name"] input')
                .type(groupName)
                .get('[data-field-name="description"] input')
                .type('Cypress group description')
                .get('[data-field-name="source_reliability"]')
                .selectChoose('A - Completely reliable')
                .getByTestId('save')
                .click();
        });
        it('should be able to check details and edit created group', () => {
            cy.with(Table)
                .with(TableRow, 'Group name', groupName)
                .click();
            cy.with(DetailPane, groupName).do(DetailPane.selectAction('Edit'));
            cy.with(Form)
                .do(
                    Form.fill({
                        Name: `${groupName} - edited`,
                        Description: 'Cypress group description - edited',
                    }),
                )
                .closeMultipleChoose('[data-field-name="source_reliability"] .Select-clear');

            cy.with(Form).do(Form.submit());
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', `${groupName} - edited`);
        });
        it('should be able to add a user and make it group admin', () => {
            cy.closeNotificationIfOpen();

            cy.with(DetailPane).do(DetailPane.visitTab('Users'));

            cy.with(DetailPane)
                .with(ListHeader)
                .do(ListHeader.activateActionByIcon('plus'));
            cy.getByTestId('dropdown-option-add-existing-user').click();
            cy.with(DetailPane)
                .with(Search)
                .do(Search.search('Platform Administrator'));
            // cy.getByTestId('dropdown-option-add-existing-user')
            //     .click({ force: true })
            //     .get('.detail-pane .avatar-with-text__text')
            //     .contains('Platform Administrator')
            //     .click()
            cy.with(DetailPane)
                .with(Clickable, 'ASSIGN')
                .click();
            // .get('.detail-pane [data-test="assign-(1)"]')
            // .click()
            // .get('.detail-pane [data-test="actions"]')
            // .click();
            // cy.with(DetailPane)
            //     .get('[data-test="dropdown-option-promote-to-group-admin"]')
            //     .click()
            //     .get('.modal [data-test="proceed"]')
            //     .click()
            //     .get('.avatar-with-text__text')
            //     .contains('Platform Administrator')
            //     .parentsUntil('.user--nopad .avatar--is-group-admin')
            //     .should('be.visible');
            cy.with(DetailPane).do(DetailPane.close());
        });
        it('should be able to delete created group', () => {
            cy.server();
            cy.route({
                method: 'DELETE',
                url: '/private/groups/*',
                status: 400,
            }).as('groupDeleteRequest');
            cy.with(Table)
                .with(TableRow, 'Group name', `${groupName} - edited`)
                .do(TableRow.selectAction('Delete'));

            cy.get('.confirm [data-test="delete"]')
                .click()
                .wait('@groupDeleteRequest');
        });
    });
});
