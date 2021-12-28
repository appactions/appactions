import { createTestable, pure, sideEffect } from '../../src/testable-tools';
import { expectToFailWithMessage } from '../../src/utils';

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

    interactions: {
        sort: (columnLabel, order) => $el => {
            $el.vDomCallDriver('sort', columnLabel, order);
        },
        sortWithDependencyChecks: (columnLabel, order) => {
            const checkDependency = pure($el => {
                if ($el.find(`th:contains(${columnLabel})`).length === 0) {
                    throw new Error('Element is not ready for interaction');
                }
                return $el;
            });

            const doSort = sideEffect($el => {
                $el.vDomCallDriver('sort', columnLabel, order);
            });

            return $el => doSort(checkDependency($el));
        },
        advancedPurityComposition: () => {
            const first = sideEffect($el => {
                setTimeout(() => {
                    $el.append(Cypress.$('<h1 class="side-effect">1. side-effect</h1>'));
                }, 500);
            });

            const second = pure(() => {
                if (Cypress.$('h1.side-effect').length !== 1) {
                    throw new Error();
                }
            });

            const third = sideEffect($el => {
                setTimeout(() => {
                    $el.append(Cypress.$('<h2 class="side-effect">2. side-effect</h2>'));
                }, 500);
            });

            const fourth = pure(() => {
                if (Cypress.$('h1.side-effect').length !== 1) {
                    throw new Error();
                }
                if (Cypress.$('h2.side-effect').length !== 1) {
                    throw new Error();
                }
            });

            return $el => {
                first($el);
                second($el);
                third($el);
                fourth($el);
            };
        },
    },
});

const TableWithRequiredColumns = createTestable({
    role: 'Table',

    customPicker: (...requiredColumns) => $el => {
        const columns = [];
        $el.vDomFind('TableHeadCell').forEach($el => {
            columns.push($el.text().trim());
        });

        if (requiredColumns.length !== columns.length || requiredColumns.some(col => !columns.includes(col))) {
            throw new Error('not all required columns are there');
        }

        return true;
    },
});

describe('Retrying', () => {
    it("with(appears delayed<spinner>) -- retry by testable's wait logic", () => {
        cy.visit('/very-slow-spinner');
        cy.with('Table')
            .read('Table', 'getColumnOrThrow', ['Fruit'])
            .should('deep.equal', ['Fruit', 'Yes', 'Yes', 'No', 'Yes']);
    });
    it("with(appears delayed<spinner>) -- retry by testable's wait logic when no `cy.do(...)` used", () => {
        cy.visit('/very-slow-spinner');
        cy.with('Table').contains('td', 'orange');
    });
    it('with(not existing) -- should timeout', () => {
        cy.visit('/instant');
        cy.with('NotExisting').should('exist');

        expectToFailWithMessage('Timed out retrying: Expected to find element: `NotExisting`, but never found it.');
    });
    it('with(not existing, \'foo, bar, baz\') -- should show the picker data in the exception', () => {
        cy.visit('/instant');

        cy.with('NotExisting', 'foo, bar, baz').should('exist');

        expectToFailWithMessage(
            'Timed out retrying: Expected to find element: `NotExisting (name: "foo, bar, baz")`, but never found it.',
        );
    });
    it('with(appears in chunks).do(interaction<without side-effect handling>) -- interaction should fail', () => {
        cy.visit('/partial');
        cy.with('Table').do('Table', 'sort', ['Color', 'asc']);
        cy.get('th').contains('Color ↑');

        expectToFailWithMessage('Column does not exist with label "Color"');
    });
    it('with(appears in chunks).do(interaction<pure dependency check>) -- interaction should not fail because of precheck', () => {
        cy.visit('/partial');
        cy.with('Table').do('Table', 'sortWithDependencyChecks', ['Color', 'asc']);
        cy.get('th').contains('Color ↑');
    });
    it('<anything>.do(interaction<advancedPurityComposition>) -- advanced side-effect handling', () => {
        cy.visit('/instant');
        cy.with('Table').do('Table', 'advancedPurityComposition');
        cy.contains('h1', '1. side-effect').should('have.lengthOf', 1);
        cy.contains('h2', '2. side-effect').should('have.lengthOf', 1);
    });
    it('with(appears in chunks) -- should retry is customPicker has thrown', () => {
        cy.visit('/partial');
        cy.with('Table', 'Name, Color, Fruit').should('exist');
    });
});
