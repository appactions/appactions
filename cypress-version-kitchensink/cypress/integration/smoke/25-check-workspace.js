import { cypressAdmin } from '../../support/constants';
import { ActionPicker, Form } from '../../support/high-level-api/testables';

const workspaceType = ['Case', 'Team', 'Topic'];

describe('workspaces', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        workspaceType.forEach(type => {
            cy.deleteItem(`Cypress ${type}`, 'workspaces');
            cy.deleteItem('Cypress workspace task', 'tickets');
        });
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check workspaces', () => {
        it('should check default workspace page', () => {
            cy.visit('/')
                .url()
                .should('include', 'main/intel/all/'); // default platform page
            // click on workspaces tab from top nav bar
            // should be redirected to workspaces page with 2 items
            cy.getByTestId('top-nav-link-workspaces')
                .click()
                .get('.grid-component')
                .find('.grid__item')
                .get('.card')
                .contains('Default Workspace');
            cy.url().should('include', 'main/intel/all/workspaces/list');
        });
        it('should create new workspace', () => {
            cy.visit('/')
                .url()
                .should('include', 'main/intel/all/'); // default platform page
            // visit workspaces page
            cy.getByTestId('top-nav-link-workspaces')
                .click()
                .url()
                .should('include', 'main/intel/all/workspaces/list');
            cy.clickPaginationIfAvailable().wait(1000);
            workspaceType.forEach(type => {
                cy.getByTestId('list-header-action-create-workspace').click();
                cy.with(Form)
                    .do(
                        Form.fillAndSubmit({
                            Name: `Cypress ${type}`,
                            Type: `${type}`,
                            'Contact info': `Smoke test contact ${type}`,
                            Description: `Smoke test Description ${type}`,
                            'Public description': `Smoke test Public Description ${type}`,
                            Analysis: `Smoke test Workspace Analysis ${type}`,
                        }),
                    )
                    .getByTestId('notification-message')
                    .contains(`Workspace created: Cypress ${type}`);
                cy.get('.spinner', { timeout: 5000, log: false }).should('not.exist');
                // Confirm that workspace is displayed in the list
                cy.visit('main/intel/all/workspaces/list');
                // Confirm that cards have correct label
                if (type === 'Topic') {
                    cy.get('.card')
                        .contains(`Cypress ${type}`)
                        .parentsUntil('.grid__item')
                        .should('have.class', 'card--green');
                } else if (type === 'Team') {
                    cy.get('.card')
                        .contains(`Cypress ${type}`)
                        .parentsUntil('.grid__item')
                        .should('have.class', 'card--orange');
                } else if (type === 'Case') {
                    cy.get('.card')
                        .contains(`Cypress ${type}`)
                        .parentsUntil('.grid__item')
                        .should('have.class', 'card--purple');
                }
            });
        });
        it('should check tabs on default workspace', () => {
            cy.visit('main/intel/all/workspaces/list')
                .url()
                .should('include', 'main/intel/all/workspaces/list');
            cy.get('.spinner', { timeout: 5000, log: false }).should('not.exist');
            cy.get('.card')
                .contains('Default Workspace')
                .click()
                .getByTestId('top-nav-select-selected-default-workspace')
                .getByTestId('top-nav-link-workspace-overview')
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Dashboard')
                // Click each tab and confirm that tab is active
                .getByTestId('top-nav-link-workspace-browse')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Browse')
                .getByTestId('top-nav-link-workspace-exposure')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Exposure')
                .getByTestId('top-nav-link-workspace-audit')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('History')
                .getByTestId('top-nav-link-workspace-tickets')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Tasks')
                .getByTestId('top-nav-link-workspace-comments')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Comments');
        });
        it('should add task to created workspace', () => {
            cy.visit('main/intel/all/workspaces/list')
                .url()
                .should('include', 'main/intel/all/workspaces/list');
            cy.clickPaginationIfAvailable().wait(1000);
            cy.get('.card')
                .contains('Cypress Case')
                .click();
            cy.getByTestId('top-nav-link-workspace-tickets')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Tasks')
                .getByTestId('list-header-action-create-task')
                .click()
                // Check that workspace is already assigned
                .get('.label')
                .contains('Workspace')
                .parents('[data-field-path="workspaces"]')
                .find('[aria-selected="true"]')
                .contains('Cypress Case')
                .get('[data-field-name="name"] input')
                .type('Cypress workspace task')
                .get('[data-field-name="description"] textarea')
                .type('Cypress workspace task description')
                .wait(100)
                .getByTestId('save')
                .click()
                .getByTestId('notification-message')
                .contains('Task created:')
                .contains('Cypress workspace task')
                // Confirm that number indicator is displayed
                .get('[data-test="top-nav-link-workspace-tickets"] .top-nav__number')
                .contains('1');
        });
        it('should add comments to workspace', () => {
            cy.visit('main/intel/all/workspaces/list')
                .url()
                .should('include', 'main/intel/all/workspaces/list');
            cy.clickPaginationIfAvailable().wait(1000);
            cy.get('.card')
                .contains('Default Workspace')
                .click();
            cy.getByTestId('top-nav-link-workspace-comments')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Comments')
                .get('.comment-list__create-comment input')
                .type('Cypress smoke comments {enter}');
        });
        it('should check that entities are visible in default workspace', () => {
            cy.visit('main/intel/all/workspaces/list')
                .url()
                .should('include', 'main/intel/all/workspaces/list');
            cy.clickPaginationIfAvailable().wait(1000);
            cy.get('.card')
                .contains('Default Workspace')
                .click();
            cy.getByTestId('top-nav-link-workspace-browse')
                .click()
                .should('have.class', 'top-nav__third-item--is-active')
                .contains('Browse')
                .get('.data-table__tbody')
                .should('be.visible')
                .get('.data-table__tbody')
                .find('tr')
                .should('not.have.length.above', 1);
        });
        it('should check that workspace can be edited', () => {
            cy.visit('main/intel/all/workspaces/list');
            cy.clickPaginationIfAvailable().wait(1000);
            cy.get('.card')
                .contains('Cypress Case')
                .click()
                .getByTestId('list-header-actions-workspace')
                .do(ActionPicker.selectAction('Edit'));

            cy.get('[data-field-name="contact_info"] .input')
                .clear()
                .type(`Smoke test contact Case Edited`)
                .get('[data-field-name="description"] .input')
                .clear()
                .type(`Smoke test Description Case Edited`)
                .get('[data-field-name="public_description"] .input')
                .clear()
                .type(`Smoke test Public Description Case Edited`)
                .get('[data-field-name="analysis"] .input')
                .clear()
                .type(`Smoke test Workspace Analysis Case Edited`)
                .getByTestId('submit')
                .click()
                // Check that data is saved correctly
                .wait(1000)
                .visit('main/intel/all/workspaces/list')
                .get('.card')
                .contains('Cypress Case')
                .click()
                .get('p')
                .contains('Smoke test Description Case Edited')
                .get('p')
                .contains('Smoke test Workspace Analysis Case Edited')
                .get('.content-area__side .simple-text')
                .contains('Smoke test contact Case Edited');
        });
        it('should archive/restore existing workspace', () => {
            cy.visit('main/intel/all/workspaces/list');
            cy.clickPaginationIfAvailable().wait(2000);
            cy.get('.card')
                .contains('Cypress Case')
                .click()
                .getByTestId('list-header-actions-workspace')
                .do(ActionPicker.selectAction('Archive'));
            cy.get('.confirm [data-test="archive"]')
                .contains('archive')
                .click()
                .wait(2000);
            cy.get('.spinner', { timeout: 5000, log: false }).should('not.exist');
            cy.visit('main/intel/all/workspaces/list')
                .wait(2000)
                .get('.card')
                .contains('Cypress Case')
                .should('not.be.visible')
                // Check that workspace is visible in archived tab
                .getByTestId('header-filter')
                .click()
                .wait(1000)
                .getByTestId('Status')
                .click()
                .wait(1000)
                .contains('Archived')
                .click()
                .wait(1000)
                .get('.simple-checkbox__label')
                .contains('Active')
                .click()
                .wait(1000)
                .get('.card')
                .contains('Cypress Case')
                .should('be.visible');
            cy.get('.card')
                .contains('Cypress Case')
                .click({ force: true })
                // Restore archived workspace
                .getByTestId('list-header-actions-workspace')
                .do(ActionPicker.selectAction('Restore'))
                .wait(1000)
                .get('.confirm [data-test="restore"]')
                .contains('restore')
                .click()
                .wait(1000)
                .visit('main/intel/all/workspaces/list')
                .getByTestId('Status')
                .click()
                .wait(1000)
                .contains('Archived')
                .click()
                .wait(2000);
            cy.get('.spinner', { timeout: 5000, log: false }).should('not.exist');
            cy.clickPaginationIfAvailable()
                .wait(2000)
                .get('.card')
                .contains('Cypress Case')
                .should('be.visible');
        });
    });
});
