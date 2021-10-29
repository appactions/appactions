import { Logo } from '../support/testables/logo';

describe('Hello App Actions', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Alert.getTitle', () => {
        cy.with(Logo).should('exist');
    });
});
