import { createTestable } from '../../src/testable-tools';

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

        getColumn: label => $el => {
            const columnsTitles = Table.getColumnLabels()($el);
            const index = columnsTitles.indexOf(label);
            const results = [];
            let i;
            $el.vDomFind('TableHeadRow, TableRow').forEach($tableRow => {
                i = 0;
                $tableRow.vDomFind('TableHeadCell, TableCell').forEach($cell => {
                    if (i === index) {
                        results.push($cell.text().trim());
                    }
                    i += 1;
                });
            });
            return results;
        },

        getColumnOrThrow: label => $el => {
            const columns = Table.getColumn(label)($el);
            if (columns.length < 5) {
                throw new Error();
            }
            return columns;
        },
    },
});

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
