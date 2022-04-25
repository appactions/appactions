describe('Recording', () => {
    it('foo', () => {
        cy.visit('/instant');
        cy.with('Table')
            .read('Table', 'getColumn', ['Fruit'])
            .should('deep.equal', ['Fruit', 'Yes', 'Yes', 'No', 'Yes']);
    });
});
