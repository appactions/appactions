import { cypressAdmin } from '../../support/constants';
import { Table, TableRow } from '../../support/high-level-api/testables';

const defaultTax = [
    'Kill Chain Phases',
    'Kill chain phase - Reconnaissance',
    'Kill chain phase - Weaponization',
    'Kill chain phase - Delivery',
    'Kill chain phase - Exploitation',
    'Kill chain phase - Installation',
    'Kill chain phase - Command and Control',
    'Kill chain phase - Actions on Objectives',
    'Admiralty Code',
    'Admiralty Code - Reliability',
    'Admiralty Code - Credibility',
    'Admiralty Code - Completely reliable',
    'Admiralty Code - Usually reliable',
    'Admiralty Code - Fairly reliable',
    'Admiralty Code - Not usually reliable',
    'Admiralty Code - Unreliable',
    'Admiralty Code - Reliability cannot be judge',
    'Admiralty Code - Confirmed by other sources',
    'Admiralty Code - Probably True',
    'Admiralty Code - Possibly True',
    'Admiralty Code - Doubtful',
    'Admiralty Code - Improbable',
    'Admiralty Code - Truth cannot be judged',
];

describe('taxonomy', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check taxonomy', () => {
        it('should check taxonomies page', () => {
            cy.visit('/')
                .url()
                .should('include', 'main/intel/all/');
            cy.getByTestId('top-nav-select')
                .contains('Intelligence')
                .click()
                .getByTestId('top-nav-select-data-configuration')
                .click()
                .getByTestId('top-nav-link-taxonomies')
                .click();
            cy.with(Table).should('be.visible');
            cy.get('.pagination-advanced__config-page-size')
                .contains('100')
                .click();
            cy.url().should('include', 'main/configuration/taxonomies?size=100');
            cy.with(Table).should('be.visible');
            defaultTax.forEach(item => {
                cy.get('.data-table__table .data-table__td--main')
                    .contains(item)
                    .should('be.visible');
            });
        });
        it('should create new taxonomy', () => {
            cy.visit('main/configuration/taxonomies?size=100')
                .url()
                .should('include', 'main/configuration/taxonomies?size=100');
            cy.getByTestId('list-header-action-create-taxonomy')
                .click()
                .get('[data-field-name="name"] .input')
                .type('1 Cypress smoke Tax')
                .get('[data-field-name="description"] .input')
                .type('1 Cypress smoke Tax')
                .get('[data-field-path="parent_id"]')
                .selectChoose('Admiralty Code - Probably True')
                .getByTestId('save')
                .wait(2000)
                .click();
            // Make sure created taxonomy is visible
            cy.clickPaginationIfAvailable().wait(1000);
            cy.with(Table)
                .with(TableRow, 'Entry name', '1 Cypress smoke Tax')
                .click()
                .get('.data-table__table .data-table__td--main')
                .contains('1 Cypress smoke Tax')
                .should('be.visible')
                .getByTestId('notification-message')
                .wait(500)
                .contains('Taxonomy created:')
                .contains('1 Cypress smoke Tax');
            cy.closeNotificationIfOpen();
        });
        it('should be able to edit and modify created taxonomy', () => {
            cy.visit('main/configuration/taxonomies?size=100')
                .url()
                .should('include', 'main/configuration/taxonomies?size=100');
            cy.with(Table).should('be.visible');
            cy.clickPaginationIfAvailable().wait(1000);
            cy.get('.data-table__table .data-table__td--main')
                .contains('1 Cypress smoke Tax')
                .parent()
                .find('.dots')
                .click()
                .get('.dropdown__menu--visible')
                .contains('Edit')
                .click()
                .wait(1000);
            cy.url().should('include', 'form=edit');
            cy.get('.app__inner').then($app => {
                if ($app.find('.spinner').is(':visible')) {
                    cy.reload();
                } else {
                    cy.log('No spinner found');
                }
            });
            cy.get('[data-field-name="name"] .input')
                .clear()
                .type('1 Cypress smoke Tax edited')
                .getByTestId('submit')
                .click()
                .wait(1000);
            // check that new name is visible
            cy.get('.spinner', { timeout: 5000, log: false }).should('not.exist');
            cy.url().should('include', 'main/configuration/taxonomies?size=100');
            cy.with(Table).should('be.visible');
            cy.get('.data-table__table .data-table__td--main')
                .contains('1 Cypress smoke Tax edited')
                .should('be.visible')
                .wait(500)
                .getByTestId('notification-message')
                .wait(500)
                .contains('1 Cypress smoke Tax');
            cy.closeNotificationIfOpen();
        });
        it('should be able to delete created taxonomy', () => {
            cy.visit('main/configuration/taxonomies?size=100')
                .url()
                .should('include', 'main/configuration/taxonomies?size=100');
            cy.with(Table).should('be.visible');
            cy.clickPaginationIfAvailable().wait(1000);
            cy.get('.data-table__table .data-table__td--main')
                .contains('1 Cypress smoke Tax')
                .parent()
                .find('.dots')
                .click()
                .wait(1000)
                .get('.dropdown__menu--visible')
                .contains('Delete')
                .click()
                .wait(1000)
                .get('.confirm ')
                .contains('Yes')
                .click()
                .wait(1000);
            // Confirm that item was deleted.
            cy.with(Table).should('be.visible');
            cy.clickPaginationIfAvailable().wait(1000);
            cy.get('.data-table__table .data-table__td--main')
                .contains('1 Cypress smoke Tax')
                .should('not.be.visible');
        });
    });
});
