import { createTestable } from 'react-app-actions';

/**
 * Handle tables.
 *
 * @memberof HigherLevelApi
 * @namespace HigherLevelApi.Table
 */
export const Table = createTestable({
    role: 'Table',

    selectors: {
        /**
         * Gets the list of column labels.
         *
         * @memberOf HigherLevelApi.Table
         * @example
         * cy
         *      .with(Table)
         *      .do(Table.getColumnLabels());
         *
         * @returns {string[]}
         */
        getColumnLabels: () => $el => {
            const columnsTitles = [];

            $el.vDomFind('DataTableHead DataTableHeader').forEach($tableHeader => {
                const hasChildren = $tableHeader.vDomCallDriver('hasChildren');
                if (hasChildren) {
                    columnsTitles.push($tableHeader.text().trim());
                }
            });

            // removing the empty string labels, because we are not considering those real column
            // this is in sync with other methods, for example getData implementations are not returning values from columns that has no header label
            return columnsTitles.filter(Boolean);
        },
        /**
         * Gets all data from the table, structured by columns.
         *
         * @memberOf HigherLevelApi.Table
         * @example
         * cy
         *      .with(Table)
         *      .do(Table.getDataByColumn());
         *
         * @returns {Object}
         */
        getDataByColumn: () => $el => {
            // "allColumnTitles" mean it contains all titles, even the emoty ones, not just the "correct" ones
            // we use that data to calculcate "ignoredColumns"
            const allColumnTitles = [];

            $el.vDomFind('DataTableHead DataTableHeader').forEach($tableHeader => {
                const hasChildren = $tableHeader.vDomCallDriver('hasChildren');
                if (hasChildren) {
                    allColumnTitles.push($tableHeader.text().trim());
                }
            });

            const results = allColumnTitles.filter(Boolean).reduce((acc, title) => ({ ...acc, [title]: [] }), {});
            const ignoredColumns = allColumnTitles.reduce((acc, curr, index) => (curr ? acc : [...acc, index]), []);

            let index;
            $el.vDomFind('DataTableRow').forEach($tableRow => {
                index = 0;
                $tableRow.vDomFind('DataTableCell').forEach($tableCell => {
                    const hasChildren = $tableCell.vDomCallDriver('hasChildren');
                    const isIgnored = ignoredColumns.includes(index);
                    if (hasChildren && !isIgnored) {
                        try {
                            results[allColumnTitles[index]].push($tableCell.textWithoutBlacklist());
                        } catch (e) {
                            console.log({
                                index,
                                allColumnTitles,
                                ignoredColumns,
                                'columnsTitles[index]': allColumnTitles[index],
                                results,
                            });
                        }
                    }
                    index += 1;
                });
            });

            return results;
        },
        /**
         * Gets all data from the table, structured by rows.
         *
         * @memberOf HigherLevelApi.Table
         * @example
         * cy
         *      .with(Table)
         *      .do(Table.getDataByRow());
         *
         * @returns {string[][]}
         */
        getDataByRow: () => $el => {
            const results = [];
            const headers = [];
            let index;

            $el.vDomFind('DataTableRow DataTableHeader').forEach($tableHeader => {
                headers.push($tableHeader.text());
            });

            const ignoredColumns = headers.reduce((acc, curr, index) => (curr ? acc : [...acc, index]), []);

            $el.vDomFind('DataTableRow').forEach($tableRow => {
                index = 0;
                results.push([]);
                $tableRow.vDomFind('DataTableHeader,DataTableCell').forEach($cell => {
                    const hasChildren = $cell.vDomCallDriver('hasChildren');
                    const isIgnored = ignoredColumns.includes(index);
                    if (hasChildren && !isIgnored) {
                        results[results.length - 1].push($cell.textWithoutBlacklist());
                    }
                    index += 1;
                });
            });

            return results;
        },
        /**
         * Get a single column.
         *
         * @memberOf HigherLevelApi.Table
         * @example
         * cy
         *      .with(Table)
         *      .do(Table.getColumn());
         *
         * @param label {string} - Label of the column.
         *
         * @returns {string[]}
         */
        getColumn: label => $el => {
            const columnsTitles = Table.getColumnLabels()($el);
            const index = columnsTitles.indexOf(label);
            const results = [];
            let i;

            $el.vDomFind('DataTableRow').forEach($row => {
                i = 0;
                $row.vDomFind('DataTableCell').forEach($cell => {
                    if (i === index) {
                        results.push($cell.textWithoutBlacklist());
                    }
                    i += 1;
                });
            });

            return results;
        },

        /**
         * Get all data from a Key-Value table. This function does not work on normal tables. When a `InKeyValTableFromJSON` passed to it, this function will be overriden by the implementation in the Key-Val Table's driver file.
         *
         * @memberOf HigherLevelApi.Table
         * @example
         * cy
         *      .with(Table)
         *      .do(Table.getData());
         *
         * @returns {Object}
         */
        getData: () => $el => {
            // this method will be overrided, when it's called in an `InKeyValTableFromJSON`
            throw new Error(
                'Table.getData is not available for this type of table. Its only supported for `Key-Value Table`.',
            );
        },
        /**
         * Get a value from a Key-Value table. This function does not work on normal tables. When a `InKeyValTableFromJSON` passed to it, this function will be overriden by the implementation in the Key-Val Table's driver file.
         *
         * @memberOf HigherLevelApi.Table
         * @example
         * cy
         *      .with(Table)
         *      .do(Table.getValue());
         *
         * @param label {string} - The label here is a key from the Key-Value table.
         *
         * @returns {string}
         */
        getValue: label => $el => {
            // this method will be overrided, when it's called in an `InKeyValTableFromJSON`
            throw new Error(
                'Table.getValue is not available for this type of table. Its only supported for `Key-Value Table`.',
            );
        },

        getRowAsJQuery: () => () => {
            throw new Error('Table.getRowAsJQuery is removed, use TableRow instead');
        },
    },

    interactions: {
        /**
         * Sorts a table.
         *
         * @memberOf HigherLevelApi.Table
         * @example
         * cy
         *      .with(Table)
         *      .do(Table.sort('Name', 'asc'))
         *
         * @param columnLabel {string} - Title of the column.
         * @param order {"asc"|"desc"} - Direction of order.
         *
         * @returns {Cypress.Chainable<any>} Returns the same subject.
         */
        sort: (columnLabel, order) => {
            if (!(order === 'asc' || order === 'desc')) {
                throw new Error('sort order must be `asc` or `desc`');
            }
            return $el => {
                $el.vDomCallDriver('sort', columnLabel, order);
            };
        },
    },
});
