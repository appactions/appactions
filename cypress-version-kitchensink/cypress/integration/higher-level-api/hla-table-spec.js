import { Table, TableRow } from '../../support/high-level-api/testables';

describe('Integration test', () => {
    beforeEach(() => {
        cy.visit('/integration-test/table', {
            onLoad(window) {
                cy.spy(window, '__log').as('log');
            },
        });
    });

    it('should be able to work with DataTable', () => {
        const getDataTable = () =>
            cy
                .get('h2')
                .contains('DataTable')
                .next();

        getDataTable()
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Header 1', 'Header 2', 'Header 3']);

        getDataTable()
            .do(Table.getDataByColumn())
            .should('deep.equal', {
                'Header 1': ['Row 1 - Cell 1', 'Row 2 - Cell 1'],
                'Header 2': ['Row 1 - Cell 2', 'Row 2 - Cell 2'],
                'Header 3': ['Row 1 - Cell 3', 'Row 2 - Cell 3'],
            });

        getDataTable()
            .do(Table.getDataByRow())
            .should('deep.equal', [
                ['Header 1', 'Header 2', 'Header 3'],
                ['Row 1 - Cell 1', 'Row 1 - Cell 2', 'Row 1 - Cell 3'],
                ['Row 2 - Cell 1', 'Row 2 - Cell 2', 'Row 2 - Cell 3'],
            ]);

        getDataTable()
            .do(Table.getColumn('Header 2'))
            .should('deep.equal', ['Row 1 - Cell 2', 'Row 2 - Cell 2']);

        getDataTable()
            .with(TableRow, 'Header 2', 'Row 2 - Cell 2')
            .do(TableRow.getData())
            .should('deep.equal', ['Row 2 - Cell 1', 'Row 2 - Cell 2', 'Row 2 - Cell 3']);

        cy.get('@log').should('not.be.called');

        getDataTable()
            .with(TableRow, 'Header 2', 'Row 2 - Cell 2')
            .click();

        cy.get('@log').should('be.calledOnce');
    });

    it('should be able to work with DataTableConfigurable', () => {
        const getDataTableConfigurable = () =>
            cy
                .get('h2')
                .contains('DataTableConfigurable')
                .next();

        getDataTableConfigurable()
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Name', 'Fruit', 'Collaborator']);

        getDataTableConfigurable()
            .do(Table.getDataByColumn())
            .should('deep.equal', {
                Name: ['Foo', 'Bar', 'Baz'],
                Fruit: ['apple', 'orange', 'pineapple'],
                Collaborator: ['Yes', 'No', 'No'],
            });

        getDataTableConfigurable()
            .do(Table.getDataByRow())
            .should('deep.equal', [
                ['Name', 'Fruit', 'Collaborator'],
                ['Foo', 'apple', 'Yes'],
                ['Bar', 'orange', 'No'],
                ['Baz', 'pineapple', 'No'],
            ]);

        getDataTableConfigurable()
            .do(Table.getColumn('Fruit'))
            .should('deep.equal', ['apple', 'orange', 'pineapple']);

        getDataTableConfigurable()
            .with(Table)
            .with(TableRow, 'Name', 'Baz')
            .do(TableRow.getData())
            .should('deep.equal', ['Baz', 'pineapple', 'No']);

        cy.get('@log').should('not.be.called');

        getDataTableConfigurable()
            .with(Table)
            .with(TableRow, 'Fruit', 'orange')
            .click();

        cy.get('@log').should('be.calledOnce');
    });

    it('should be able to work with DataTableAdvanced', () => {
        const getDataTableAdvanced = () =>
            cy
                .get('h2')
                .contains('DataTableAdvanced')
                .next();

        getDataTableAdvanced()
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Name', 'Last name', 'First name']);

        getDataTableAdvanced()
            .do(Table.getDataByColumn())
            .should('deep.equal', {
                Name: [
                    'Platform Administrator',
                    'Idella Schamberger',
                    'Henri Kutch',
                    'Maurine Barton',
                    'General Mitchell',
                    'Alfredo Durgan',
                    'Nannie Reichert',
                    'Hailie Watsica',
                    'Damaris Boyer',
                    'Ryder Lubowitz',
                ],
                'Last name': [
                    'Administrator',
                    'Schamberger',
                    'Kutch',
                    'Barton',
                    'Mitchell',
                    'Durgan',
                    'Reichert',
                    'Watsica',
                    'Boyer',
                    'Lubowitz',
                ],
                'First name': [
                    'Platform',
                    'Idella',
                    'Henri',
                    'Maurine',
                    'General',
                    'Alfredo',
                    'Nannie',
                    'Hailie',
                    'Damaris',
                    'Ryder',
                ],
            });

        getDataTableAdvanced()
            .do(Table.getDataByRow())
            .should('deep.equal', [
                ['Name', 'Last name', 'First name'],
                ['Platform Administrator', 'Administrator', 'Platform'],
                ['Idella Schamberger', 'Schamberger', 'Idella'],
                ['Henri Kutch', 'Kutch', 'Henri'],
                ['Maurine Barton', 'Barton', 'Maurine'],
                ['General Mitchell', 'Mitchell', 'General'],
                ['Alfredo Durgan', 'Durgan', 'Alfredo'],
                ['Nannie Reichert', 'Reichert', 'Nannie'],
                ['Hailie Watsica', 'Watsica', 'Hailie'],
                ['Damaris Boyer', 'Boyer', 'Damaris'],
                ['Ryder Lubowitz', 'Lubowitz', 'Ryder'],
            ]);

        getDataTableAdvanced()
            .do(Table.getColumn('Last name'))
            .should('deep.equal', [
                'Administrator',
                'Schamberger',
                'Kutch',
                'Barton',
                'Mitchell',
                'Durgan',
                'Reichert',
                'Watsica',
                'Boyer',
                'Lubowitz',
            ]);

        getDataTableAdvanced()
            .with(Table)
            .with(TableRow, 'First name', 'Platform')
            .do(TableRow.getData())
            .should('deep.equal', ['Platform Administrator', 'Administrator', 'Platform']);

        // test click on row

        cy.get('@log').should('not.be.called');

        getDataTableAdvanced()
            .with(Table)
            .with(TableRow, 'First name', 'Platform')
            .click();

        cy.get('@log').should('be.calledOnce');

        // sort

        getDataTableAdvanced()
            .do(Table.sort('Name', 'asc'))
            .do(Table.getDataByColumn(), 'Name.0')
            .should('eq', 'Alfredo Durgan');
        getDataTableAdvanced()
            .do(Table.sort('Name', 'desc'))
            .do(Table.getDataByColumn(), 'Name.0')
            .should('eq', 'Ryder Lubowitz');
        getDataTableAdvanced()
            .do(Table.sort('Name', 'desc'))
            .do(Table.getDataByColumn(), 'Name.0')
            .should('eq', 'Ryder Lubowitz');
    });

    it('should be able to work with DataTableStatic', () => {
        const getDataTableStatic = () =>
            cy
                .get('h2')
                .contains('DataTableStatic')
                .next();

        getDataTableStatic()
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Name', 'Fruit', 'Collaborator']);

        getDataTableStatic()
            .do(Table.getDataByColumn())
            .should('deep.equal', {
                Name: ['Bar', 'Baz', 'Foo'],
                Fruit: ['orange', 'pineapple', 'apple'],
                Collaborator: ['No', 'No', 'Yes'],
            });

        getDataTableStatic()
            .do(Table.getDataByRow())
            .should('deep.equal', [
                ['Name', 'Fruit', 'Collaborator'],
                ['Bar', 'orange', 'No'],
                ['Baz', 'pineapple', 'No'],
                ['Foo', 'apple', 'Yes'],
            ]);

        getDataTableStatic()
            .do(Table.getColumn('Fruit'))
            .should('deep.equal', ['orange', 'pineapple', 'apple']);

        getDataTableStatic()
            .with(Table)
            .with(TableRow, 'Name', 'Baz')
            .do(TableRow.getData())
            .should('deep.equal', ['Baz', 'pineapple', 'No']);

        cy.get('@log').should('not.be.called');

        getDataTableStatic()
            .with(Table)
            .with(TableRow, 'Fruit', 'pineapple')
            .click();

        cy.get('@log').should('be.calledOnce');
    });

    it('should be able to work with DataTreeTableStatic', () => {
        const getDataTreeTableStatic = () =>
            cy
                .get('h2')
                .contains('DataTreeTableStatic')
                .next();

        getDataTreeTableStatic()
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Name', 'Fruit', 'Collaborator']);

        getDataTreeTableStatic()
            .do(Table.getDataByColumn())
            .should('deep.equal', {
                Name: ['Foo', 'Bar', 'Baz'],
                Fruit: ['apple', 'orange', 'pineapple'],
                Collaborator: ['Yes', 'No', 'No'],
            });

        getDataTreeTableStatic()
            .do(Table.getDataByRow())
            .should('deep.equal', [
                ['Name', 'Fruit', 'Collaborator'],
                ['Foo', 'apple', 'Yes'],
                ['Bar', 'orange', 'No'],
                ['Baz', 'pineapple', 'No'],
            ]);

        getDataTreeTableStatic()
            .do(Table.getColumn('Fruit'))
            .should('deep.equal', ['apple', 'orange', 'pineapple']);

        getDataTreeTableStatic()
            .with(Table)
            .with(TableRow, 'Name', 'Baz')
            .do(TableRow.getData())
            .should('deep.equal', ['Baz', 'pineapple', 'No']);

        cy.get('@log').should('not.be.called');

        getDataTreeTableStatic()
            .with(Table)
            .with(TableRow, 'Collaborator', 'Yes')
            .click();

        cy.get('@log').should('be.calledOnce');
    });

    it('should be able to work with CrudTable', () => {
        const getCrudTable = () =>
            cy
                .get('h2')
                .contains('CrudTable')
                .next();

        getCrudTable()
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Name', 'Fruit', 'Collaborator']);

        getCrudTable()
            .do(Table.getDataByColumn())
            .should('deep.equal', {
                Name: ['Foo', 'Bar', 'Baz'],
                Fruit: ['apple', 'orange', 'pineapple'],
                Collaborator: ['Yes', 'No', 'No'],
            });

        getCrudTable()
            .do(Table.getDataByRow())
            .should('deep.equal', [
                ['Name', 'Fruit', 'Collaborator'],
                ['Foo', 'apple', 'Yes'],
                ['Bar', 'orange', 'No'],
                ['Baz', 'pineapple', 'No'],
            ]);

        getCrudTable()
            .do(Table.getColumn('Fruit'))
            .should('deep.equal', ['apple', 'orange', 'pineapple']);

        getCrudTable()
            .with(Table)
            .with(TableRow, 'Name', 'Baz')
            .do(TableRow.getData())
            .should('deep.equal', ['Baz', 'pineapple', 'No']);

        cy.get('@log').should('not.be.called');

        getCrudTable()
            .with(Table)
            .with(TableRow, 'Collaborator', 'Yes')
            .click();

        cy.get('@log').should('be.calledOnce');

        getCrudTable()
            .with(Table)
            .with(TableRow, 'Fruit', 'orange')
            .do(TableRow.selectAction('Uranus'));
    });

    it('should be able to work with InKeyValTableFromJSON', () => {
        const getInKeyValTableFromJSON = () =>
            cy
                .get('h2')
                .contains('InKeyValTableFromJSON')
                .next();

        getInKeyValTableFromJSON()
            .do(Table.getColumnLabels())
            .should('deep.equal', ['Foo', 'Bar', 'Baz']);

        getInKeyValTableFromJSON().then($el => {
            expect(() => Table.getDataByColumn()($el)).to.throw;
        });

        getInKeyValTableFromJSON().then($el => {
            expect(() => Table.getDataByRow()($el)).to.throw;
        });

        getInKeyValTableFromJSON().then($el => {
            expect(() => Table.getColumn('Fruit')($el)).to.throw;
        });

        getInKeyValTableFromJSON().then($el => {
            expect(() => Table.getRow('Name', 'Baz')($el)).to.throw;
        });

        getInKeyValTableFromJSON()
            .do(Table.getData())
            .should('deep.equal', {
                Foo: '4',
                Bar: '300',
                Baz: 'hello',
            });

        getInKeyValTableFromJSON()
            .do(Table.getValue('Bar'))
            .should('equal', '300');
    });
});
