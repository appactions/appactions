import { expectToFailWithMessage } from '../../src/utils';
import { vDomFind, vDomClosest, vDomCallDriver } from '../../src/vdom-utils';

describe('VDOM utils', () => {
    describe('As jQuery functions', () => {
        it('vDomFind -- should be able to find elements by React component name', () => {
            cy.visit('/instant');
            cy.then(() => {
                const $headCells = Cypress.$('.app').vDomFind('TableHeadCell');
                expect($headCells).to.have.lengthOf(3);
                expect(
                    $headCells
                        .eq(0)
                        .text()
                        .trim(),
                ).to.be.equal('Name');
                expect(
                    $headCells
                        .eq(1)
                        .text()
                        .trim(),
                ).to.be.equal('Color');
                expect(
                    $headCells
                        .eq(2)
                        .text()
                        .trim(),
                ).to.be.equal('Fruit');
            });
        });
        it('vDomFind -- should support the comma operator', () => {
            cy.visit('/instant');
            cy.then(() => {
                const $headCells = Cypress.$('.app').vDomFind('TableHeadCell, TableCell');
                expect($headCells).to.have.lengthOf(15);
            });
        });
        it('vDomFind -- should support the space operator', () => {
            cy.visit('/multiple');
            cy.then(() => {
                const $headCells = Cypress.$('.app').vDomFind('Table TableHeadCell');
                expect($headCells).to.have.lengthOf(9);
            });
        });
        it('vDomFind -- should support testables as selectors', () => {
            cy.visit('/instant');
            cy.then(() => {
                const $headCells = Cypress.$('.app').vDomFind('Table TableRowTestable');
                expect($headCells).to.have.lengthOf(4);
            });
        });
        it('vDomFind -- should fail if called on non-React rendered element', () => {
            cy.visit('/instant');
            cy.then(() => {
                Cypress.$('body').vDomFind('TableHeadCell');
            });

            expectToFailWithMessage('could not locate React node for DOM element');
        });
        it('vDomClosest -- should be able to iterate upwards', () => {
            cy.visit('/instant');
            cy.then(() => {
                const $table = Cypress.$('td:contains("orange")').vDomClosest('Table');
                expect($table[0]).to.have.class('table');
            });
        });
        it('vDomClosest -- does not support the comma operator', () => {
            cy.visit('/instant');
            cy.then(() => {
                Cypress.$('td:contains("orange")').vDomClosest('Table, TableRow');
            });

            expectToFailWithMessage('`vDomClosest` does not support the comma operator');
        });
        it('vDomClosest -- does not support the space operator', () => {
            cy.visit('/multiple');
            cy.then(() => {
                Cypress.$('td:contains("orange")').vDomClosest('Table TableRow');
            });

            expectToFailWithMessage('`vDomClosest` does not support the space operator');
        });
        it('vDomClosest -- should support testables as selector', () => {
            cy.visit('/instant');
            cy.then(() => {
                const $table = Cypress.$('td:contains("orange")').vDomClosest('TableRowTestable');
                expect($table[0]).to.have.class('table-row');
            });
        });
        it.skip('vDomCallDriver -- should be able to call drivers', () => {
            cy.visit('/instant');
            cy.then(() => {
                Cypress.$('.app')
                    .vDomFind('Table')
                    .vDomCallDriver('sort', 'Name', 'asc');
            });
            cy.get('th').contains('Name ↑');
        });
        it('forEach -- polyfill for better iterator on jQuery selections', () => {
            cy.visit('/instant');
            cy.then(() => {
                const result = [];
                Cypress.$('.app')
                    .vDomFind('TableHeadCell')
                    .forEach(($el, index, arr) => {
                        result.push({
                            tagName: $el.get(0).tagName.toLowerCase(),
                            index,
                            arrayLength: arr.length,
                        });
                    });

                expect(result).to.deep.equal([
                    { tagName: 'th', index: 0, arrayLength: 3 },
                    { tagName: 'th', index: 1, arrayLength: 3 },
                    { tagName: 'th', index: 2, arrayLength: 3 },
                ]);
            });
        });
    });
    describe('As plain helper functions', () => {
        it('vDomFind -- should work', () => {
            cy.visit('/instant');
            cy.then(() => {
                const headCells = vDomFind(Cypress.$('.app'), 'TableHeadCell');
                expect(headCells).to.have.lengthOf(3);
            });
        });
        it('vDomClosest -- should work', () => {
            cy.visit('/instant');
            cy.then(() => {
                const table = vDomClosest(Cypress.$('td:contains("orange")'), 'Table');
                expect(table[0]).to.have.class('table');
            });
        });
        it.skip('vDomCallDriver -- should work', () => {
            cy.visit('/instant');
            cy.then(() => {
                vDomCallDriver(Cypress.$('.app').vDomFind('Table'), 'sort', 'Name', 'asc');
            });
            cy.get('th').contains('Name ↑');
        });
    });
});
