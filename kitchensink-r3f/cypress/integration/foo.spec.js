context('Window', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('42 is 42', () => {
        cy.wrap(42).should('equal', 42);
    });
});
