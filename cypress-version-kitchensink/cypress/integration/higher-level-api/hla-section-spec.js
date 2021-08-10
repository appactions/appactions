import { Section } from '../../support/high-level-api/testables';

describe('Section', () => {
    beforeEach(() => {
        cy.visit('/integration-test/section');
    });

    it('Section selection should work', () => {
        cy.with(Section).should('have.lengthOf', 2);
        cy.with(Section, 'Lorem ipsum').should('have.lengthOf', 1);
    });
});
