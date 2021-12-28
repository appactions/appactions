describe('Picking', () => {
    it('with(instant, default picker) -- default function should only return the picked items', () => {
        cy.visit('/headers');
        cy.with('Header', (name, index, array) => {
            return index > array.length / 2;
        }).should('have.lengthOf', 2);
    });
    it('with(instant, custom picker) -- selector should only return the picked elements', () => {
        cy.visit('/headers');
        cy.with('Header', 'Apple').should('have.lengthOf', 1);
    });
    it('with(instant).do(selector, default picker) -- default function', () => {
        cy.visit('/instant');
        cy.with('Table')
            .read('Table', 'getDataByColumn', null, data => data['Name'][1])
            .should('equal', 'Banana');
    });
    it('with(instant).do(selector, picker string) -- getter should return with the picked key', () => {
        cy.visit('/instant');
        cy.with('Table')
            .read('Table', 'getDataByColumn', null, 'Name.1')
            .should('equal', 'Banana');
    });
});
