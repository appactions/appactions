import uuid from 'uuid/v4';
import { cypressAdmin } from '../../support/constants';
import { uploadFile } from '../../support/api/upload';
import { FilterPanel, Table } from '../../support/high-level-api/testables';
import { randomNumber } from '../../support/generate';

const entityTypes = [
    'Campaign',
    'Course of action',
    'Exploit target',
    'Incident',
    'Indicator',
    'Report',
    'Threat actor',
    'TTP',
];

const exposureState = ['Detection', 'Prevention', 'Sighting'];

const actionMenu = ['Edit', 'Edit', 'Override exposure', 'Add to dataset', 'Add to graph', 'Create task'];

describe('exposure', () => {
    const uniqueNumber = randomNumber();
    before(() => {
        cy.sessionStorageClear();
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.fixture('upload-all-entity-types.json').then(data => {
            const newEntities = data.entities.reduce(
                (acc, model) => [
                    ...acc,
                    {
                        ...model,
                        data: {
                            ...model.data,
                            id: model.data.id.slice(0, -36).concat(uuid()),
                            title: `${model.data.title} ${uniqueNumber}`,
                        },
                    },
                ],
                [],
            );
            const newData = { ...data, entities: newEntities };
            uploadFile(newData, 'entityTypes.json', 'Testing Group', 10000);
        });
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Check exposure page', () => {
        it('should check that exposed entities are showed in the list with exposed mark', () => {
            cy.getByTestId('top-nav-link-exposure').click();
            cy.waitPageForLoad();
            cy.get('.exposure_status--exposed').should('be.visible');
        });
        it('should check columns sorting and filtering', () => {
            cy.getByTestId('header-filter').click();
            cy.with(FilterPanel)
                .contains('Entity type')
                .should('be.visible');
            // loop over entity types to check all filter options
            entityTypes.forEach(entity => {
                cy.get(`.filter__options [title="${entity}"]`);
            });
        });
        it('should check refresh action', () => {
            cy.with(Table)
                .find('button.refresh')
                .should('be.visible')
                .click()
                .get('.spinner-overlay')
                .should('be.visible');
        });
        it('should check action menu of first entity', () => {
            cy.getByTestId('actions')
                .first()
                .find('.dropdown--style-dots')
                .click();
            actionMenu.forEach(option => {
                cy.get('.dropdown__option').contains(option);
            });
            cy.get('.dropdown__option')
                .contains('Override exposure')
                .click()
                .get('.modal__close')
                .click();
        });
        it('should check override with sighting action on first entity', () => {
            // filter by uniqueNumber, so we get the entities we just uploaded.
            cy.get('[data-test="search-input"]').type(`${uniqueNumber}{enter}`);
            cy.with(Table);

            // order by name to get deterministic results (after doing some actions the order of entities can change)
            cy.get('[data-test="table-header-meta.title"]').click();
            cy.with(Table);

            cy.getByTestId('actions')
                .first()
                .find('.dropdown--style-dots')
                .click()
                .get('.dropdown__option')
                .contains('Override exposure')
                .click();
            exposureState.forEach(type => {
                cy.contains(type);
            });
            cy
                // will click Sighting and will override exposure state to ON
                .get('fieldset:last-child')
                .find('.checkbox__checkbox')
                .last()
                .click()
                // will check that date was set
                .get('fieldset:last-child')
                .find('.DateInput input')
                .last()
                .should('have.attr', 'value');
            // close modal
            cy.get('.modal [data-test="submit"]').click();
            // confirm that entity is sighted

            cy.wait(1500);
            cy.with(Table)
                .find('button.refresh')
                .should('be.visible')
                .click()
                .get('.spinner-overlay')
                .should('be.visible');
            cy.get('[data-test="exposure.sighted"] .icon-base')
                .first()
                .should('have.class', 'icon-warning');
        });
        it('should check override with detection action on second entity', () => {
            cy.getByTestId('actions')
                .eq(1)
                .find('.dropdown--style-dots')
                .click()
                .get('.dropdown__option')
                .contains('Override exposure')
                .click();
            exposureState.forEach(type => {
                cy.contains(type);
            });
            cy
                // will click Detection and will override exposure state to ON
                .get('fieldset:last-child')
                .find('.checkbox__checkbox')
                .first()
                .click()
                // will check that date was set
                .get('fieldset:last-child')
                .find('.DateInput input')
                .first()
                .should('have.attr', 'value');
            // close modal
            cy.get('.modal [data-test="submit"]').click();
            // confirm that entity is detected
            cy.wait(1500);
            cy.with(Table)
                .find('button.refresh')
                .should('be.visible')
                .click()
                .get('.spinner-overlay')
                .should('be.visible');
            cy.with(Table)
                .find('.data-table__tr--clickable')
                .eq(1) // find the first table row that contains results
                .find('.exposure_bullet--green') // that should have inside it a green exposure bullet
                .should('be.visible'); // and make sure it's visible

            //cy.get('[data-test="exposure.detect_ok"] .exposure_bullet--green').should('be.visible');
        });
    });
});
