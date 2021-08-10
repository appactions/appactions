import { cypressAdmin } from '../../support/constants';
import {
    DetailPane,
    Clickable,
    Table,
    TableRow,
    Modal,
    Notification,
    ListHeader,
    Form,
    Input,
} from '../../support/high-level-api/testables';
import { createEntity } from '../../support/api/entities';
import { fetchSourceIdsByNames } from '../../support/api/sources';
import generate from '../../support/generate';

const entityTitle = generate.title();

describe('tasks', () => {
    before(() => {
        fetchSourceIdsByNames(['Testing Group']).then(source => {
            createEntity({
                data: {
                    title: entityTitle,
                },
                sources: [
                    {
                        source_id: source[0],
                    },
                ],
            });
        });

        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.deleteItem('Cypress smoke task', 'tickets');
    });

    describe('Check tasks creation', () => {
        it('should check that new task can be created', () => {
            cy.visit('/main/intel/all/tasks?size=100');
            cy.with(ListHeader).do(ListHeader.activateActionByTitle('Create task'));
            cy.with(DetailPane);
            cy.with(Form).do(
                Form.fillAndSubmit({
                    Name: 'Cypress smoke task',
                    Description: 'Cypress smoke task',
                }),
            );

            cy.with(TableRow, 'Task', 'Cypress smoke task').should('exist');
        });
        it('should add entities to created task by editing it', () => {
            cy.with(TableRow, 'Task', 'Cypress smoke task').click();
            cy.with(DetailPane).do(DetailPane.selectAction('Edit'));

            cy.with(Input, 'Entities')
                .with(Clickable, 'Add')
                .click();

            cy.with(Modal)
                .with(TableRow, 'Name', entityTitle)
                .find('input[type="checkbox"]')
                .click();

            cy.with(Modal)
                .with(Clickable, 'Select (1)')
                .click();

            cy.with(Form).do(Form.submit());

            cy.with(DetailPane)
                .with(TableRow, 'Name', entityTitle)
                .should('exist');
        });
        it('should check that task can be canceled', () => {
            cy.with(TableRow, 'Task', 'Cypress smoke task').click();
            cy.wait(500);
            cy.with(DetailPane).do(DetailPane.selectAction('Cancel'));

            cy.with(DetailPane)
                .with(Modal)
                .with(Clickable, 'Yes')
                .click();

            cy.with(DetailPane).do(DetailPane.close());

            cy.with(TableRow, 'Task', 'Cypress smoke task')
                .do(TableRow.getCell('Status'))
                .should('equal', 'Cancelled');
        });
        it('should check that task can be deleted', () => {
            cy.with(TableRow, 'Task', 'Cypress smoke task').click();
            cy.with(DetailPane).do(DetailPane.selectAction('Delete'));
            cy.with(DetailPane)
                .with(Modal)
                .with(Clickable, 'Delete')
                .click();

            cy.with(TableRow, 'Task', 'Cypress smoke task').should('not.exist');
        });
    });
});
