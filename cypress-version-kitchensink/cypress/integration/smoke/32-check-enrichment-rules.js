import { cypressAdmin } from '../../support/constants';
import generate from '../../support/generate';
import { Clickable, Form } from '../../support/high-level-api/testables';

// This test requires Extensions to be installed in the AMI
// The AMIs used in the Nightly Builds do not have extensions installed, so this test always fails
describe.skip('entity enrichment', () => {
    const enrichmentRule = `Cypress-enrich-rule-${generate.randomNumber()}`;
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.deleteItem('Cypress enrichment rule', 'enrichment-rules');
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });
    //remove skip when RC1 is delivered
    describe('Check entity rules', () => {
        it('should create entity rule', () => {
            cy
                // Navigate to rules
                .getByTestId('top-nav-select')
                .contains('Intelligence')
                .click()
                .getByTestId('top-nav-select-data-configuration')
                .click()
                .getByTestId('top-nav-link-rules')
                .click()
                // Start entity rule
                .getByTestId('tab-item')
                .contains('Enrichment')
                .click()
                .getByTestId('list-header-action-create-rule')
                .click()
                .wait(1000);
            cy.with(Form)
                .do(
                    Form.fill({
                        Name: enrichmentRule,
                        Description: 'Cypress description enrichment rule',
                        Enrichers: ['CVE Search Enricher'],
                    }),
                )
                .get('[name="is_active"]')
                .click({ force: true });
            cy.with(Clickable, 'Save')
                .click()
                .getByTestId('notification-message')
                .contains('Enrichment created:')
                .contains(enrichmentRule);
        });
        it('should run open details of created rule', () => {
            cy.get('.data-table__table .data-table__td--main')
                .contains(enrichmentRule)
                .click()
                .wait(1000)
                // Make sure that rule is enable
                .get('.detail-pane .button-group__item--active')
                .contains('Enabled')
                // Make sure that correct 1 enricher is displayed
                .get('.detail-pane .key-val-table__key')
                .should('be.visible');
        });
    });
});

// Enrichment created: Cypress enrichment
