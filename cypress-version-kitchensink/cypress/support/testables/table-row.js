import { createTestable } from 'react-app-actions';
import { Table } from './table';
import { ActionPicker } from './action-picker';

function getIgnoredIndexes($el) {
    const ignoredIndexes = [];

    $el.vDomClosest('Table')
        .vDomFind('DataTableHeader')
        .forEach(($el, index) => {
            if (!$el.text().trim().length) {
                ignoredIndexes.push(index);
            }
        });

    return ignoredIndexes;
}

export const TableRow = createTestable({
    role: 'TableRow',

    customPicker: (columnLabel, value) => $el => {
        if (!columnLabel && !value) {
            return true;
        }

        const labels = TableRow.getColumnLabels()($el);

        if (!labels.includes(columnLabel)) {
            throw new Error(`There is no column with label "${columnLabel}"`);
        }

        const columnIndex = labels.indexOf(columnLabel);

        const rowData = TableRow.getData()($el);

        return rowData[columnIndex] === value;
    },

    interactions: {
        selectAction: (...path) => $el => {
            const $actionPicker = $el.vDomFind('ActionPicker');
            ActionPicker.select(...path)($actionPicker);
        },
    },

    selectors: {
        getColumnLabels: () => $el => {
            const $table = $el.vDomClosest('Table');
            if (!$table.length) {
                throw new Error('could not locate table');
            }
            return Table.getColumnLabels()($table);
        },
        getData: () => $el => {
            const ignoredIndexes = getIgnoredIndexes($el);
            const result = [];
            $el.vDomFind('DataTableCell').forEach(($cell, index) => {
                if (!ignoredIndexes.includes(index)) {
                    result.push($cell.textWithoutBlacklist());
                }
            });
            return result;
        },
        getCell: columnLabel => $el => {
            const labels = TableRow.getColumnLabels()($el);
            const index = labels.indexOf(columnLabel);
            if (index === -1) {
                throw new Error(`there is no column named "${columnLabel}"`);
            }
            const data = TableRow.getData()($el);
            return data[index];
        },
        isActionItemActive: (...path) => $el => {
            const $actionPicker = $el.vDomFind('ActionPicker');
            return ActionPicker.isItemActive(...path)($actionPicker);
        },
    },
});
