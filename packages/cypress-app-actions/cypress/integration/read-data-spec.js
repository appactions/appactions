describe('Read data', () => {
    it('with(instant appear).do(selector) -- happypath', () => {
        cy.visit('/instant');
        cy.with('Table')
            .read('Table', 'getColumn', ['Fruit'])
            .should('deep.equal', ['Fruit', 'Yes', 'Yes', 'No', 'Yes']);
    });
    it('with(appears in chunks).do(selector).should -- retry', () => {
        cy.visit('/partial');
        cy.with('Table')
            .read('Table', 'getColumn', ['Fruit'])
            .should('deep.equal', ['Fruit', 'Yes', 'Yes', 'No', 'Yes']);
    });
    it('with(appears in chunks).do(selector<throw>) -- retry', () => {
        cy.visit('/partial');
        cy.with('Table')
            .read('Table', 'getColumnOrThrow', ['Fruit'])
            .should('deep.equal', ['Fruit', 'Yes', 'Yes', 'No', 'Yes']);
    });
});
