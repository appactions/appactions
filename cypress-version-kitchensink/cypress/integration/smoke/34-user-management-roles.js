import { cypressAdmin } from '../../support/constants';
import {
    ListHeader,
    Clickable,
    DetailPane,
    Form,
    Modal,
    Table,
    TableRow,
    Notification,
} from '../../support/high-level-api/testables';

describe('user-management', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.deleteItem('Cypress role edited', 'roles');
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check groups', () => {
        it('should be able to create a role', () => {
            cy.visit('/user-management/roles');

            cy.with(ListHeader).do(ListHeader.activateActionByIcon('plus'));

            cy.with(DetailPane)
                .with(Form)
                .do(
                    Form.fillAndSubmit({
                        Name: 'Cypress role',
                        Description: 'Cypress role description',
                        Permissions: ['Select all options'],
                    }),
                );

            cy.wait(500);

            cy.with(Table)
                .with(TableRow, 'Role name', 'Cypress role')
                .should('exist');
        });
        it('should be able to check details and edit created role', () => {
            cy.visit('/user-management/roles');
            cy.waitPageForLoad();

            cy.with(Table)
                .with(TableRow, 'Role name', 'Cypress role')
                .do(TableRow.selectAction('Edit'));

            cy.with(DetailPane)
                .with(Form)
                .do(
                    Form.fillAndSubmit({
                        Name: 'Cypress role edited',
                    }),
                );

            cy.wait(500);
            // weird: looks like the submit above triggers a page refresh that breaks the page render, the 'visit' fixes
            cy.visit('/user-management/roles?size=100');

            cy.with(Table)
                .with(TableRow, 'Role name', 'Cypress role edited')
                .should('exist');
        });
        it('should be able to delete created role', () => {
            cy.with(Table)
                .with(TableRow, 'Role name', 'Cypress role edited')
                .do(TableRow.selectAction('Delete'));

            cy.with(Modal)
                .with(Clickable, 'Delete')
                .click();

            cy.wait(500);

            cy.with(Notification)
                .do(Notification.getNotification())
                .should('contain', 'Cypress role edited')
                .should('contain', 'deleted');
        });
    });
});
