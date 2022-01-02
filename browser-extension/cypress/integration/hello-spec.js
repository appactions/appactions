describe('Foo', () => {
    it('Bar', () => {
        cy.visit('/');
        cy.with('App').should('exist');
    });
});
