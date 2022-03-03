describe('Hello test', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('displays two todo items by default', () => {
        cy.get('.react-trello-board').should('exist');
    });
});
