import { cypressAdmin } from '../../support/constants';
import { Clickable, DetailPane, Form, Search, Table, TableRow } from '../../support/high-level-api/testables';
import apiConnect from '../../support/api/api-connect';
import { randomNumber } from '../../support/generate';
import { createGroup } from '../../support/groups/helper';

const uniqueName = randomNumber();
const api = apiConnect(cypressAdmin);

describe('entity builder campaign', () => {
    let source;
    before(() => {
        cy.sessionStorageClear();
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

    describe('Check entity builder for campaign form from left panel', () => {
        it('should be able to create a new ttp with only mandatory fields filled in', () => {
            cy.visit('/main/intel/all/production/add/campaign');
            cy.with(Form).do(
                Form.fill({
                    Title: `CyCamp-${uniqueName}`,
                    Analysis: 'CyCamp Company',
                    Confidence: 'Low',
                    Status: 'Future',
                    Description: 'CyCamp info',
                    Identity: 'CyCamp ID',
                    Roles: ['Select all options'],
                    Source: source.name,
                    TLP: 'Green',
                    'Terms of use': 'Used with cypress',
                    'Half-life': 250,
                    References: ['https://localhost8888.cmp'],
                    'Intended effects': ['Select all options'],
                    'Estimated observed time': '2019-11-13',
                    'Estimated threat end time': '2021-11-13',
                    'Estimated threat start time': '2019-11-05T06:08:00+01:00',
                }),
            );

            // HLA can't yet cover fields that already have an index
            cy.get('[data-field-name="names[0]"] input').type('CypressName');
            cy.with(Form)
                .with(Clickable, 'Publish')
                .click();
        });
        it('should be able to find created entity', () => {
            cy.with(Search).do(Search.search(`CyCamp-${uniqueName}`));
            cy.with(Table)
                .with(TableRow, 'Name', `CyCamp-${uniqueName}`)
                .click();
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', `CyCamp-${uniqueName}`);
        });
    });
});
