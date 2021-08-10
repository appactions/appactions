import { cypressAdmin } from '../../support/constants';
import {
    Clickable,
    Collapsible,
    DetailPane,
    Form,
    Dropdown,
    Search,
    Table,
    TableRow,
    Section,
} from '../../support/high-level-api/testables';
import generate from '../../support/generate';
import apiConnect from '../../support/api/api-connect';
import { createGroup } from '../../support/groups/helper';

const uniqueName = `CySigh-${generate.randomNumber()}`;
const api = apiConnect(cypressAdmin);

describe('entity builder Company-sighting', () => {
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

    describe('Check entity builder for Company-sighting form from left panel', () => {
        it('should be able to create a new sighting', () => {
            cy.visit('/main/intel/all/production/add/Company-sighting');
            cy.with(Form).do(
                Form.fill({
                    Title: uniqueName,
                    Analysis: 'CySigh Company',
                    Confidence: 'Low',
                    Impact: 'Medium',
                    Source: source.name,
                    'Estimated observed time': '2019-11-13',
                    'Estimated threat end time': '2020-11-13',
                    'Estimated threat start time': '2019-11-05T06:08:00+01:00',
                    TLP: 'Green',
                    'Terms of use': 'Used with cypress',
                    'Half-life': 250,
                }),
            );
            addSecurityControlCaracteristic();
            addRawEventCaracteristic();
            addRelatedObservableCharacteristic();
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

function addSecurityControlCaracteristic() {
    cy.with(Section, 'Characteristics')
        .with(Dropdown)
        .do(Dropdown.select('Security Control'));
    cy.get('[data-field-path="identity.name"] [type="text"]').type('new Sighting identity');
    cy.get('[data-field-path="time.start"] [id="date"]').type('10/10/2020');
    cy.get('[data-field-path="time.start"] [id="date"]').click();
    cy.get('[data-field-path="time.start_precision"] .Select-multi-value-wrapper').click();
    cy.get('.in-select__option')
        .contains('day')
        .click();
    cy.get('[data-field-path="time.end"] [id="date"]').type('20/10/2020');
    cy.get('[data-field-path="time.end_precision"] .Select-multi-value-wrapper').click();
    cy.get('.in-select__option')
        .contains('month')
        .click();
    cy.get('[data-field-path="time.received"] [id="date"]').type('10/10/2020');
    cy.get('[data-field-path="time.received_precision"] .Select-multi-value-wrapper').click();
    cy.get('.in-select__option')
        .contains('hour')
        .click();
    cy.get('[data-field-path="references.reference"] [type="text"]').type('http://foobar.sh');
    cy.with(Section, 'Characteristics')
        .with(Collapsible)
        .do(Collapsible.toggle('Security Control'));
}

function addRawEventCaracteristic() {
    cy.with(Section, 'Characteristics')
        .with(Dropdown)
        .do(Dropdown.select('Raw Events'));
    cy.get('[data-field-path="raw_events"] [name="raw_events"]').type(generate.description());
}

function addRelatedObservableCharacteristic() {
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains(`Related Observables`)
        .click();
    cy.get('[data-field-path="related_extracts.0.kind"] .in-select').click();
    cy.get('.in-select__option')
        .contains('Actor')
        .click();
    cy.get('[data-field-path="related_extracts.0.value"] [type="text"]').type('APT1');
}
