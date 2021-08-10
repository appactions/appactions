import { cypressAdmin } from '../../support/constants';
import { randomNumber, userName } from '../../support/generate';
import { DetailPane, Form, Search, Table, TableRow } from '../../support/high-level-api/testables';
import apiConnect from '../../support/api/api-connect';
import { createGroup } from '../../support/groups/helper';

const uniqueName = randomNumber();
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

    describe('Check entity builder for ttp form from left panel', () => {
        it('should be able to create a new ttp with only mandatory fields filled in', () => {
            const behaviorChars = ['exploit', 'malware', 'attack-pattern'];
            const resourceChars = ['infrastructure', 'persona', 'tools'];
            cy.visit('/main/intel/all/production/add/ttp');
            cy.with(Form).do(
                Form.fill({
                    Title: `CyTTP-${uniqueName}`,
                    Analysis: 'CyTTP Company',
                    'Intended effects': ['Fraud'],
                    Description: 'CyTTP info',
                    Identity: 'CyTTP ID',
                    Roles: ['Select all options'],
                    Source: source.name,
                    TLP: 'Amber',
                    'Terms of use': 'Used with cypress',
                    'Half-life': 100,
                    References: ['https://localhost8888.ttp'],
                    'Estimated observed time': '2019-11-14',
                    'Estimated threat end time': '2019-12-15',
                    'Estimated threat start time': '2019-10-05T07:08:00+01:00',
                }),
            );
            // Iterate through characteristic types to avoid code multiplication
            for (let i = 0; i < behaviorChars.length; i++) {
                openBehaviorCharacteristic(behaviorChars[i]);
                openResourcesCharacteristic(resourceChars[i]);
            }
            openTargetedVictimCharacteristic();
            cy.getByTestId('publish')
                .click()
                .getByTestId('notification-message')
                .contains(`Creating entity 'CyTTP-${uniqueName}'`)
                .url()
                .should('include', '/main/intel/all/production/published');
        });

        it('should be able to find created entity', () => {
            cy.with(Search).do(Search.search(`CyTTP-${uniqueName}`));
            cy.with(Table)
                .with(TableRow, 'Name', `CyTTP-${uniqueName}`)
                .click();
            cy.with(DetailPane)
                .do(DetailPane.getTitle())
                .should('contain', `CyTTP-${uniqueName}`);
        });
    });
});

function openBehaviorCharacteristic(type) {
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains('Behavior')
        .trigger('mouseover')
        .getByTestId(`dropdown-option-${type}`)
        .click();
    // Wrap the characteristic that is currently active (opened)
    cy.activeCharacteristic().then(el => {
        // Using conditioning I'm adding different text to type fields
        if (type === 'malware') {
            cy.wrap(el)
                .find('[type="text"]')
                .type('Cypress TTP Malware char Name');
            cy.wrap(el)
                .find('[data-test="types"]')
                .selectChoose('Select all options')
                .click();
        } else if (type === 'exploit') {
            cy.wrap(el)
                .find('[name="title"]')
                .type('Cypress TTP Exploit char Title');
            cy.wrap(el)
                .find('[name="description"]')
                .type('Cypress TTP Exploit char Description');
        } else {
            cy.wrap(el)
                .find('[name="capec_id"]')
                .type('467');
            cy.wrap(el)
                .find('[name="title"]')
                .type('Cypress TTP Exploit Attack Pattern Title');
            cy.wrap(el)
                .find('[name="description"]')
                .type('Cypress TTP Exploit Attack Pattern Description');
        }
        // Close active characteristics
        cy.get('.collapse--active .collapse__title').click();
    });
}

function openResourcesCharacteristic(type) {
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains('Resources')
        .trigger('mouseover')
        .getByTestId(`dropdown-option-${type}`)
        .click();
    cy.activeCharacteristic().then(el => {
        if (type === 'infrastructure') {
            cy.wrap(el)
                .find('[name="title"]')
                .type('Cypress TTP Infrastructure char Title');
            cy.wrap(el)
                .find('[name="description"]')
                .type('Cypress TTP Infrastructure Description');
            cy.wrap(el)
                .find('[data-test="types"]')
                .selectChoose('Select all options')
                .click();
        } else if (type === 'persona') {
            cy.wrap(el)
                .find('[name="name"]')
                .type('Cypress TTP Persona char Name');
        } else {
            cy.wrap(el)
                .find('[name="name"]')
                .type('Cypress TTP Tools Name');
            cy.wrap(el)
                .find('[name="description"]')
                .type('Cypress TTP Tools Description');
            cy.wrap(el)
                .find('[data-test="types"]')
                .selectChoose('Select all options')
                .click();
        }
        cy.get('.collapse--active .collapse__title').click();
    });
}

function openTargetedVictimCharacteristic() {
    cy.get('.dropdown__toggle')
        .contains('Characteristic')
        .click();
    cy.get('.dropdown__menu--with-children')
        .contains('Targeted victim')
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
            .type('Cypress TTP Targeted Victim');
        cy.wrap(el)
            .find('[data-test="targeted_systems"]')
            .selectChoose('Select all options')
            .click();
        cy.wrap(el)
            .find('[data-test="targeted_information"]')
            .selectChoose('Select all options')
            .click();
        // Iterate through Fields type
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
