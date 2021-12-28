import { createTestable } from '../../src/testable-tools';

const Header = createTestable({
    role: 'Header',

    customPicker: title => $el => {
        return $el.text().includes(title);
    },
});

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
        getDataByColumn: () => $el => {
            const results = {};
            const columnsTitles = Table.getColumnLabels()($el);
            columnsTitles.forEach(title => {
                results[title] = Table.getColumn(title)($el).slice(1);
            });
            return results;
        },
    },
});

describe.only('Picking', () => {
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
