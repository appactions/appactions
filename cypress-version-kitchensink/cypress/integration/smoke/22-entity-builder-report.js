import { cypressAdmin } from '../../support/constants';
import { Clickable, DetailPane, Form, Search, Table, TableRow } from '../../support/high-level-api/testables';
import { randomNumber } from '../../support/generate';
import apiConnect from '../../support/api/api-connect';
import { createGroup } from '../../support/groups/helper';

const uniqueName = randomNumber();
const api = apiConnect(cypressAdmin);

describe('entity builder report', () => {
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

    describe('Check entity builder for report form from left panel', () => {
        it('should be able to create a new report', () => {
            // Some fields are not yet covered by HLA
            cy.visit('/main/intel/all/production/add/report')
                .get('[data-field-name="title"] input')
                .type(`CyRep-${uniqueName}`)
                .wysiwygFields('SUMMARY', 'Cypress wysiwyg Summary')
                .wysiwygFields('Analysis *', 'Cypress wysiwyg Analysis');
            cy.get('[data-field-name="intents"]')
                .selectChoose('TTP - Tools')
                .closeMultipleChoose('[data-field-name="intents"]');
            cy.with(Form).do(
                Form.fill({
                    Description: 'CypressReport info',
                    Identity: 'CypressReport ID',
                    Roles: ['Select all options'],
                    Source: source.name,
                    TLP: 'Amber',
                    'Terms of use': 'Used with cypress',
                    'Half-life': 250,
                    References: ['https://localhost8888.report'],
                    'Estimated observed time': '2020-11-13',
                    'Estimated threat end time': '2021-11-13',
                    'Estimated threat start time': '2020-11-05T06:08:00+01:00',
                }),
            );

            cy.with(Form)
                .with(Clickable, 'Publish')
                .click();
        });
        it('should be able to find created entity', () => {
            cy.with(Search).do(Search.search(`CyRep-${uniqueName}`));
            cy.with(Table)
                .with(TableRow, 'Name', `CyRep-${uniqueName}`)
                .click();
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', `CyRep-${uniqueName}`);
        });
    });
});
