import { createTestable } from '../../src/testable-tools';
import { expectToFailWithMessage } from '../../src/utils';

describe('Timeout', () => {
    it('does wait over the command timeout, when `isLoading` is implemented', () => {
        const Table = createTestable({
            role: 'Table',

            isLoading($el) {
                return $el.hasClass('spinner');
            },

            selectors: {
                getColumnLabels: () => $el => {
                    const columnsTitles = [];

                    $el.vDomFind('TableHeadRow TableHeadCell').forEach($tableHeadCell => {
                        columnsTitles.push($tableHeadCell.text().trim());
                    });

                    return columnsTitles;
                },
            },
        });

        cy.visit('/super-slow-spinner');
        cy.with(Table)
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Name', 'Color', 'Fruit']);
    });
    it('timeouts, when `isLoading` is not implemented', () => {
        const Table = createTestable({
            role: 'Table',

            selectors: {
                getColumnLabels: () => $el => {
                    const columnsTitles = [];

                    $el.vDomFind('TableHeadRow TableHeadCell').forEach($tableHeadCell => {
                        columnsTitles.push($tableHeadCell.text().trim());
                    });

                    return columnsTitles;
                },
            },
        });

        cy.visit('/super-slow-spinner');
        cy.with(Table)
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Name', 'Color', 'Fruit']);

        expectToFailWithMessage(
            "Timed out retrying: expected [ '...', '...' ] to deeply equal [ 'Name', 'Color', 'Fruit' ]",
        );
    });
});
