import { cypressAdmin } from '../../support/constants';
import { DetailPane, Form, Search, Table, TableRow } from '../../support/high-level-api/testables';
import apiConnect from '../../support/api/api-connect';
import { randomNumber } from '../../support/generate';
import { createGroup } from '../../support/groups/helper';

const uniqueName = randomNumber();
const api = apiConnect(cypressAdmin);

describe('entity builder indicator', () => {
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

    describe('Check entity builder for indicator form from left panel', () => {
        it('should be able to create a new indicator', () => {
            const testChars = ['YARA', 'Snort', 'Generic'];
            cy.visit('/main/intel/all/production/add/indicator');
            cy.with(Form).do(
                Form.fill({
                    Title: `CyInd-${uniqueName}`,
                    Analysis: 'CyInd Company',
                    Types: ['Select all options'],
                    Description: 'CyInd info',
                    Identity: 'CyInd ID',
                    Roles: ['Initial Author'],
                    Source: source.name,
                    TLP: 'Amber',
                    'Terms of use': 'Used with cypress',
                    'Half-life': 200,
                    References: ['https://localhost8888.indicator'],
                    'Estimated observed time': '2018-11-13',
                    'Estimated threat end time': '2018-11-13',
                    'Estimated threat start time': '2018-11-05T06:08:00+01:00',
                }),
            );
            // Fill in data into Time Window characteristic
            openTimeCharacteristic('Time window');
            // Loop through all types of Test characteristics and fill in the data
            for (let i = 0; i < testChars.length; i++) {
                openTestCharacteristic(testChars[i]);
            }
            // Fill in data into Sighting characteristic
            openSightingCharacteristic('Sighting');
            cy.getByTestId('publish')
                .click()
                .getByTestId('notification-message')
                .contains(`Creating entity 'CyInd-${uniqueName}'`)
                .url()
                .should('include', '/main/intel/all/production/published');
        });
        it('should be able to find created entity', () => {
            cy.with(Search).do(Search.search(`CyInd-${uniqueName}`));
            cy.with(Table)
                .with(TableRow, 'Name', `CyInd-${uniqueName}`)
                .click();
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', `CyInd-${uniqueName}`);
        });
    });
});

function openSightingCharacteristic(type) {
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains(`${type}`)
        .click();
    cy.activeCharacteristic().then(el => {
        cy.wrap(el)
            .find('[name="sighted"]')
            .check();
    });
    cy.get('.collapse--active .collapse__title').click();
}

function openTimeCharacteristic(type) {
    const startTime = '10/10/2020';
    const endTime = '20/10/2020';
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains(`${type}`)
        .click();
    cy.activeCharacteristic().then(el => {
        cy.wrap(el)
            .find('[data-field-path="start"] [name="date"]')
            .type(startTime)
            .click()
            .wrap(el)
            .find('[data-field-path="end"] [name="date"]')
            .type(endTime)
            .click()
            .wrap(el)
            .find('[data-field-path="start_precision"]')
            .selectChoose('month')
            .wrap(el)
            .find('[data-field-path="end_precision"]')
            .selectChoose('day');
    });
}

function openTestCharacteristic(type) {
    const start = '10/11/2020';
    const end = '10/12/2020';
    const received = '10/9/2020';
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains('Test mechanism')
        .click();
    // I'm adding data as close as possible to real life
    cy.activeCharacteristic().then(el => {
        cy.wrap(el)
            .find('[data-field-path="test_mechanism_type"]')
            .selectChoose(type)
            .wrap(el)
            .find('[data-field-path="efficacy"]')
            .selectChoose('High');
        if (type === 'Snort') {
            // Fill in data for Snort type
            cy.wrap(el)
                .find('[name="rules[0]"] ')
                .type('log tcp any any -> 192.168.1.0/24 !6000:6010')
                .wrap(el)
                .find('[name="product_name"]')
                .type('Cypress')
                .wrap(el)
                .find('[name="version"]')
                .type('3.1.5')
                .wrap(el)
                .find('[name="event_filters[0]"]')
                .type('event_filter \\ gen_id 1, sig_id 1851, \\ type limit, track by_src, \\ count 1, seconds 60')
                .wrap(el)
                .find('[name="rate_filters[0]"]')
                .type(
                    'rate_filter \\\n' +
                        '        gen_id <gid>, sig_id <sid>, \\\n' +
                        '        track <by_src|by_dst|by_rule>, \\\n' +
                        '        count <c>, seconds <s>, \\\n' +
                        '        new_action alert|drop|pass|log|sdrop|reject, \\\n' +
                        '        timeout <seconds> \\\n' +
                        '        [, apply_to <ip-list>]',
                )
                .wrap(el)
                .find('[name="event_suppressions[0]"]')
                .type('suppress gen_id 1, sig_id 1852, track by_src, ip 1.1.1.1')
                .wrap(el)
                .find('[name="producer[identity][name]"]')
                .type('Cypress Producer');
        } else if (type === 'Generic') {
            cy.wrap(el)
                .find('[name="description"] ')
                .type(`Cypress ${type} description`)
                .wrap(el)
                .find('[data-field-path="efficacy"]')
                .selectChoose('Medium')
                .wrap(el)
                .find('[name="specification"]')
                .type(`Cypress ${type} Specification`);
        } else {
            cy.wrap(el)
                .find('[name="rule"] ')
                .type(
                    'rule JavaDeploymentToolkit\n' +
                        '{\n' +
                        '   meta:\n' +
                        '      ref = "CVE-2010-0887"\n' +
                        '      impact = 7\n' +
                        '      author = "@d3t0n4t0r"\n' +
                        '   strings:\n' +
                        '      $cve20100887_1 = "CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA" nocase fullword' +
                        '}',
                )
                .wrap(el)
                .find('[name="producer[identity][name]"]')
                .type('Cypress');
        }
        cy.wrap(el)
            .find('[data-field-path="producer.time.start"] [name="date"]')
            .type(start, { force: true })
            .click()
            .wrap(el)
            .find('[data-field-path="producer.time.end"] [name="date"]')
            .type(end, { force: true })
            .click()
            .wrap(el)
            .find('[data-field-path="producer.time.received"] [name="date"]')
            .type(received)
            .click()
            .wrap(el)
            .find('[data-field-path="producer.time.start_precision"]')
            .selectChoose('second')
            .wrap(el)
            .find('[data-field-path="producer.time.end_precision"]')
            .selectChoose('minute')
            .wrap(el)
            .find('[data-field-path="producer.time.received_precision"]')
            .selectChoose('hour')
            .wrap(el)
            .find('.fieldset-producer .quick-add input')
            .type('https://yara.readthedocs.io/en/v3.4.0/writingrules.html')
            .get('.collapse--active .collapse__title')
            .click();
    });
}
