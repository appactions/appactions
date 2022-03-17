import { expectToFailWithMessage } from '../src/utils';

describe('Timeout', () => {
    it('does wait over the command timeout, when `isLoading` is implemented', () => {
        cy.visit('/super-slow-spinner');
        cy.with('Table')
            .read('Table', 'getColumnLabels')
            .should('deep.equal', ['Name', 'Color', 'Fruit']);
    });
    it('timeouts, when `isLoading` is not implemented', () => {
        cy.visit('/super-slow-spinner');
        cy.with('HeadRow')
            .read('HeadRow', 'getColumnLabels')
            .should('deep.equal', ['Name', 'Color', 'Fruit']);

        expectToFailWithMessage(
            "Timed out retrying: expected [ '...', '...' ] to deeply equal [ 'Name', 'Color', 'Fruit' ]",
        );
    });
});
