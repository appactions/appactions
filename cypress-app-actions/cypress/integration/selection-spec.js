describe('Selection', () => {
    it('with(instant appear) -- happypath', () => {
        cy.visit('/instant');
        cy.with('Table')
            .should('exist')
            .and('have.class', 'table');
    });
    it('with(not existing) -- timeout', () => {
        cy.visit('/instant');
        cy.with('NotExisting').should('not.exist');
    });
    it('with(instant appear<multiple>) -- has subject', () => {
        cy.visit('/multiple');
        cy.get('div[data-test="last-table"]')
            .with('Table')
            .should('have.lengthOf', 1);
    });
    // i'm not sure if this is a necessary behaviour
    // dropping it for now, because it removes a lot of complexity
    it.skip('with(instant appear) -- subject is same el that is expected to be selected', () => {
        cy.visit('/instant');
        cy.contains('h4', 'Hello Table!')
            .next()
            .with('Table')
            .should('have.lengthOf', 1);
    });
    it('with(appears delayed) -- retry while empty', () => {
        cy.visit('/slow');
        cy.with('Table')
            .should('exist')
            .and('have.class', 'table');
    });
    it('with(instant appear<multiple>) -- can select multiple patterns', () => {
        cy.visit('/multiple');
        cy.with('Table').should($el => {
            expect($el).to.have.lengthOf(3);
            expect($el.eq(0)).to.have.class('table');
            expect($el.eq(1)).to.have.class('table');
            expect($el.eq(2)).to.have.class('table');
        });
    });
    it('with(instant appear<multiple>).contains(...) -- works with other cypress commands', () => {
        cy.visit('/multiple');
        cy.with('Table')
            .contains('table', 'Green')
            .should('have.lengthOf', 1);
    });
});
