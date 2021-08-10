import { cypressAdmin } from '../../support/constants';
import { randomNumber, userName } from '../../support/generate';
import { Clickable, DetailPane, Form, Search, Table, TableRow } from '../../support/high-level-api/testables';
import apiConnect from '../../support/api/api-connect';
import { createGroup } from '../../support/groups/helper';

const entityName = `CyTA-${randomNumber()}`;
const api = apiConnect(cypressAdmin);

describe('entity builder threat-actor', () => {
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

    describe('Check entity builder for threat-actor form from left panel', () => {
        it('should be able to create a new threat-actor', () => {
            cy.visit('/main/intel/all/production/add/threat-actor');
            cy.with(Form).do(
                Form.fill({
                    Name: entityName,
                    Analysis: 'CyTA Company',
                    Types: ['Select all options'],
                    Confidence: 'Medium',
                    Description: 'CyTA info',
                    Identity: 'CyTA ID',
                    Roles: ['Initial Author'],
                    Source: source.name,
                    TLP: 'Amber',
                    'Terms of use': 'Used with cypress',
                    'Half-life': 100,
                    References: ['https://localhost8888.threatActor'],
                    'Estimated observed time': '2019-10-14',
                    'Estimated threat end time': '2019-12-15',
                    'Estimated threat start time': '2019-11-05T07:08:00+01:00',
                }),
            );
            openIntentCharacteristic();
            openIdentityCharacteristic();
            cy.server();
            cy.route({ method: 'POST', url: '/private/entities/' }).as('entities');
            cy.with(Form)
                .with(Clickable, 'Publish')
                .click();
            cy.wait('@entities').should(xhr => {
                expect(xhr.status).to.equal(201);
            });
        });
        it('should be able to find created entity', () => {
            cy.with(Search).do(Search.search(entityName));
            cy.with(Table)
                .with(TableRow, 'Name', entityName)
                .click();
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', entityName);
        });
    });
});

function openIntentCharacteristic() {
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains('Intent')
        .click();
    cy.activeCharacteristic().then(el => {
        cy.wrap(el)
            .find('[data-test="motivations"]')
            .selectChoose('Ego')
            .closeMultipleChoose('[data-test="motivations"]')
            .wrap(el)
            .find('[data-test="sophistication"]')
            .selectChoose('Aspirant')
            .closeMultipleChoose('[data-test="sophistication"]')
            .wrap(el)
            .find('[data-field-path="intended_effects"]')
            .selectChoose('Unauthorized Access')
            .closeMultipleChoose('[data-test="intended_effects"]')
            .wrap(el)
            .find('[data-field-path="planning_and_operational_support"]')
            .selectChoose('Skill Development / Recruitment - Military Programs')
            .closeMultipleChoose('[data-test="planning_and_operational_support"]')
            .get('.collapse--active .collapse__title')
            .click();
    });
}

function openIdentityCharacteristic() {
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains('Identity')
        .click();
    cy.activeCharacteristic().then(el => {
        // Declare arrays for specification fields
        const fieldsType = ['Account', 'Person', 'Organization', 'Electronic address'];
        const accountSpecification = [
            'Account ID',
            'Issuing authority',
            'Account type',
            'Account branch',
            'Issuing country name',
        ];
        const personSpecification = [
            'Preceding title',
            'Title',
            'First name',
            'Middle name',
            'Last name',
            'Other name',
            'Alias name',
            'Generation identifier',
            'Degree',
        ];
        const organizationSpecification = ['Name only', 'Type only (i.e. "Inc")', 'Full name'];
        const emailSpecification = [
            'AIM',
            'EMAIL',
            'GOOGLE',
            'GIZMO',
            'ICQ',
            'JABBER',
            'MSN',
            'SIP',
            'SKYPE',
            'URL',
            'XRI',
            'YAHOO',
        ];
        cy.wrap(el)
            .find('[name="name"]')
            .type('Cypress TA Targeted Victim');
        // Iterate through Fields type to cover them all in one test
        for (let j = 0; j < fieldsType.length; j++) {
            if (fieldsType[j] === 'Account') {
                cy.wrap(el)
                    .find('.dropdown__toggle')
                    .contains('Fields')
                    .click();
                cy.wrap(el)
                    .find('.dropdown__menu--with-children')
                    .contains(`${fieldsType[j]}`)
                    .click();
                cy.log(fieldsType[j]);
                cy.wrap(el)
                    .find(`[name="specification[${j}][account_type]"]`)
                    .type('Victim Account Type');
                cy.wrap(el)
                    .find(`[name="specification[${j}][account_status]"]`)
                    .type('Victim Account Status');
                // Iterate through account types
                for (let i = 0; i < accountSpecification.length; i++) {
                    cy.wrap(el)
                        .find(`.fieldset-specification-${j} .in-form__repeatable-add`)
                        .click();
                    cy.wrap(el)
                        .find(`[data-field-name="specification[${j}][account_specification][${i}][type]"]`)
                        .selectChoose(`${accountSpecification[i]}`);
                    cy.wrap(el)
                        .find(`[name="specification[${j}][account_specification][${i}][value]"]`)
                        .type(randomNumber());
                }
            }
            if (fieldsType[j] === 'Person') {
                cy.wrap(el)
                    .find('.dropdown__toggle')
                    .contains('Fields')
                    .click();
                cy.wrap(el)
                    .find('.dropdown__menu--with-children')
                    .contains(`${fieldsType[j]}`)
                    .click();
                cy.log(fieldsType[j]);
                // Iterate through person types
                for (let i = 0; i < personSpecification.length; i++) {
                    cy.wrap(el)
                        .find(`.fieldset-specification-${j} .in-form__repeatable-add`)
                        .click();
                    cy.wrap(el)
                        .find(`[data-field-name="specification[${j}][person_name][${i}][type]"]`)
                        .selectChoose(`${personSpecification[i]}`);
                    cy.wrap(el)
                        .find(`[name="specification[${j}][person_name][${i}][value]"]`)
                        .type(randomNumber());
                }
            }
            if (fieldsType[j] === 'Organization') {
                cy.wrap(el)
                    .find('.dropdown__toggle')
                    .contains('Fields')
                    .click();
                cy.wrap(el)
                    .find('.dropdown__menu--with-children')
                    .contains(`${fieldsType[j]}`)
                    .click();
                cy.log(fieldsType[j]);
                // Iterate through organization types
                for (let i = 0; i < organizationSpecification.length; i++) {
                    cy.wrap(el)
                        .find(`.fieldset-specification-${j} .in-form__repeatable-add`)
                        .click();
                    cy.wrap(el)
                        .find(`[data-field-name="specification[${j}][organisation_name][${i}][type]"]`)
                        .selectChoose(`${organizationSpecification[i]}`);
                    cy.wrap(el)
                        .find(`[name="specification[${j}][organisation_name][${i}][value]"]`)
                        .type(randomNumber());
                }
            }
            if (fieldsType[j] === 'Electronic address') {
                let specOrder = j;
                // Iterate through email types
                for (let i = 0; i < emailSpecification.length; i++) {
                    cy.wrap(el)
                        .find('.dropdown__toggle')
                        .contains('Fields')
                        .click();
                    cy.wrap(el)
                        .find('.dropdown__menu--with-children')
                        .contains(`${fieldsType[j]}`)
                        .click();
                    cy.log(fieldsType[j]);
                    if (
                        emailSpecification[i] === 'EMAIL' ||
                        emailSpecification[i] === 'GOOGLE' ||
                        emailSpecification[i] === 'YAHOO'
                    ) {
                        cy.wrap(el)
                            .find(`[data-field-name="specification[${specOrder}][electronic_address][type]"]`)
                            .selectChoose(`${emailSpecification[i]}`);
                        cy.wrap(el)
                            .find(`[name="specification[${specOrder}][electronic_address][value]"]`)
                            .type(email());
                    } else {
                        cy.wrap(el)
                            .find(`[data-field-name="specification[${specOrder}][electronic_address][type]"]`)
                            .selectChoose(`${emailSpecification[i]}`);
                        cy.wrap(el)
                            .find(`[name="specification[${specOrder}][electronic_address][value]"]`)
                            .type(randomNumber());
                    }
                    // Increase this variable to be able to find next spec since each email type will increase specification order number
                    ++specOrder;
                    cy.log(specOrder);
                }
            }
        }
        cy.get('.collapse--active .collapse__title').click();
    });
}

function email() {
    const username = userName();
    return `${username}@localhost`;
}
