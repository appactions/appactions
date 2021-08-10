import { Form, DetailPane, Search, Table, TableRow } from '../../support/high-level-api/testables';
import { cypressAdmin } from '../../support/constants';
import { randomNumber } from '../../support/generate';
import apiConnect from '../../support/api/api-connect';
import { createGroup } from '../../support/groups/helper';

const uniqueName = randomNumber();
const api = apiConnect(cypressAdmin);

describe('entity builder course-of-action', () => {
    let source;
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        createGroup().then(group => {
            source = group;
        });
    });

    after(() => {
        cy.getQueryStringValue('id').then(entityID => {
            api.delete(`entities/${entityID}`);
        });
        api.delete(`groups/${source.id}`);
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check entity builder for course-of-action form from left panel', () => {
        it('should be able to create a new course-of-action', () => {
            const single = ['Type', 'Stage', 'Objective'];
            const singleOptions = ['Patching', 'Remedy', 'Low'];
            const multiple = ['Impact', 'Cost', 'Efficacy'];
            const multipleOptions = ['Unknown', 'High', 'None'];
            cy.visit('/main/intel/all/production/add/course-of-action');
            cy.with(Form).do(
                Form.fill({
                    Title: `CyCOA-${uniqueName}`,
                    Analysis: 'CyCOA Company',
                    Description: 'Cypress info',
                    Identity: 'Cypress ID',
                    Roles: ['Initial Author'],
                    Source: source.name,
                    TLP: 'Amber',
                    'Terms of use': 'Used with cypress',
                    'Half-life': 200,
                    References: ['https://localhost8888.coa'],
                    'Estimated observed time': '2018-11-13',
                    'Estimated threat end time': '2018-11-13',
                    'Estimated threat start time': '2018-11-05T06:08:00+01:00',
                }),
            );
            // Loop through all types of characteristics and fill in the data
            for (let i = 0; i < single.length; i++) {
                openSingleTypeCharacteristic(single[i], singleOptions[i]);
                openMultipleTypeCharacteristic(multiple[i], multipleOptions[i], multipleOptions[i]);
            }
            // I left low level api since HLA is not working when I need to check it twice
            cy.getByTestId('publish').click();
            cy.getByTestId('notification-message').contains(`Creating entity 'CyCOA-${uniqueName}'`);
        });
        it('should be able to find created entity', () => {
            cy.with(Search).do(Search.search(`CyCOA-${uniqueName}`));
            cy.with(Table)
                .with(TableRow, 'Name', `CyCOA-${uniqueName}`)
                .click();
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', `CyCOA-${uniqueName}`);
        });
    });
});

function openSingleTypeCharacteristic(type, item) {
    // Fill in all fields on similar characteristic types that have single field
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains(`${type}`)
        .click();
    cy.get('.collapse--active').selectChoose(`${item}`);
    // Add conditional for Objective field type since it has an additional field
    if (type === 'Objective') {
        cy.get('.collapse--active .input').type('COA Obj description');
    }
    cy.get('.collapse--active .collapse__title').click();
}

function openMultipleTypeCharacteristic(type, value, confidence) {
    // Fill in all fields on similar characteristic types that have multiple fields
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains(`${type}`)
        .click();
    cy.get('.collapse--active [data-field-path="value"]').selectChoose(`${value}`);
    cy.get('.collapse--active [data-field-path="confidence"]').selectChoose(`${confidence}`);
    cy.get('.collapse--active .input').type(`COA ${type} description`);
    cy.get('.collapse--active .collapse__title').click();
}
