import { Alert } from '../../support/high-level-api/testables';

describe('Alert', () => {
    beforeEach(() => {
        cy.visit('/integration-test/alert');
    });

    it('Alert.getTitle', () => {
        cy.with(Alert)
            .do(Alert.getTitle())
            .should('eq', 'My alert title');
    });
    it('Alert.getMessage', () => {
        cy.with(Alert)
            .do(Alert.getMessage())
            .should('eq', 'Success is not final, failure is not fatal, it is the courage to continue that counts.');
    });
});
