import { cypressAdmin } from '../../support/constants';
import generate from '../../support/generate';

import { DetailPane, Form, Clickable, Search, Table, TableRow } from '../../support/high-level-api/testables';
import { createGroup } from '../../support/groups/helper';

const uniqueName = `CyInc-${generate.randomNumber()}`;

describe('entity builder Incident', () => {
    let source;
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        createGroup().then(group => {
            source = group;
        });
        cy.clearWorkInProgress();
    });

    after(() => {
        cy.logout();
    });

    // Note you need to run in headless mode, UI crashes since test is complex
    describe('Check entity builder for incident form from left panel', () => {
        it('should be able to create a new incident with only mandatory fields filled in', () => {
            cy.visit('/main/intel/all/production/add/incident');
            cy.with(Form).do(
                Form.fill({
                    Title: uniqueName,
                    Categories: ['Select all options'], // required
                    'Intended effects': ['Select all options'], // required
                    'Discovery methods': ['Select all options'], // required
                    Roles: ['Select all options'],
                    Source: source.name,
                    TLP: 'White',
                    'Half-life': 250,
                }),
            );

            cy.with(Form)
                .with(Clickable, 'Publish')
                .click();
        });
        it('should be able to find created entity', () => {
            cy.with(Search).do(Search.search(uniqueName));
            cy.with(Table)
                .with(TableRow, 'Name', uniqueName)
                .click();
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', uniqueName);
        });
    });
});
