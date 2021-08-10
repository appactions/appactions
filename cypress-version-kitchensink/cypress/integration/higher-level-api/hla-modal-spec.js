import { Modal } from '../../support/high-level-api/testables';

describe('Modal', () => {
    beforeEach(() => {
        cy.visit('/integration-test/modal');
    });

    it('Modal.close', () => {
        cy.with(Modal).should('exist');
        cy.with(Modal).do(Modal.close());
        cy.with(Modal).should('not.exist');
    });
});
