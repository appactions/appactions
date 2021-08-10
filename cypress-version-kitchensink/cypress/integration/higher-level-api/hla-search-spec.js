import { Search, Table } from '../../support/high-level-api/testables';

describe('Search', () => {
    beforeEach(() => {
        cy.visit('/integration-test/search');
    });

    it('Search.search', () => {
        cy.with(Search).do(Search.search('apple'));
        cy.with(Table)
            .do(Table.getDataByColumn())
            .should('deep.equal', {
                Fruit: ['Apple', 'Pineapple'],
                'Header 2': [],
                'Header 3': [],
            });
    });
});
