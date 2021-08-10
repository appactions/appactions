import { cypressAdmin } from '../../support/constants';
import { ActionPicker, Form, Modal, Table, TableRow, Clickable, ListHeader, DetailPane } from '../../support/testables';
import { createGroup } from '../../support/groups/helper';
import { fetchSourceIdsByNames } from '../../support/api/sources';
import { createEntity } from '../../support/api/entities';
import generate from '../../support/generate';

describe('intel-sets', () => {
    let groupName;
    const datasetStatic = `Cypress smoke set static - ${generate.randomNumber()}`;
    const datasetDynamic = `Cypress smoke set dynamic - ${generate.randomNumber()}`;
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        createGroup().then(group => {
            groupName = group.name;
            fetchSourceIdsByNames([group.name]).then(ids =>
                createEntity({
                    data: {
                        title: `set_${generate.uid()}`,
                    },
                    sources: [
                        {
                            source_id: `${ids[0]}`,
                        },
                    ],
                }),
            );
        });
    });
    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    it('should check that dataset screen is displayed', () => {
        // find and open dataset screen
        cy.getByTestId('top-nav-link-browse').click();
        cy.getByTestId('tab-item')
            .contains('Datasets')
            .should('be.visible')
            .click();
    });
    it('should check new dynamic dataset can be created', () => {
        cy.visit('main/intel/all/browse/datasets');
        cy.with(ListHeader).do(ListHeader.activateActionByTitle('Create dataset'));
        cy.with(Form)
            .do(
                Form.fill({
                    'Dataset name': datasetDynamic,
                    Dynamic: true,
                    Workspaces: ['Select all options'],
                    'Search query': `sources.name:"${groupName}"`,
                }),
            )
            .do(Form.submit());
        cy.with(Table).should('contain', datasetDynamic);
    });
    it('should check that entities were added to dataset', () => {
        cy.visit('main/intel/all/browse/datasets');
        cy.with(Table)
            .with(TableRow, 'Dataset name', datasetDynamic)
            .click();

        cy.with(DetailPane)
            .with(Clickable, 'Open Dataset')
            .click();

        cy.get('.content-section__content')
            .contains(`sources.name:"${groupName}"`)
            .should('be.visible');
        cy.with(Table)
            .find('tr')
            .eq(0)
            .should('contain', 'Name');
    });
    it('should check that dynamic dataset can be deleted', () => {
        cy.visit('main/intel/all/browse/datasets');
        cy.closeDetailPaneIfOpen();
        cy.with(Table)
            .with(TableRow, 'Dataset name', datasetDynamic)
            .click();
        cy.with(DetailPane)
            .with(ActionPicker)
            .do(ActionPicker.selectAction('Delete'));
        cy.with(Modal)
            .with(Clickable, 'Delete')
            .click();
        cy.with(Table).should('not.contain', datasetDynamic);
        cy.with(DetailPane).should('not.exist');
    });
    it('should check new static dataset can be created', () => {
        cy.getByTestId('list-header-action-create-dataset')
            .should('be.visible')
            .click();
        cy.with(Form)
            .do(
                Form.fill({
                    'Dataset name': datasetStatic,
                    Workspaces: ['Select all options'],
                }),
            )
            .do(Form.submit());
        cy.with(Table).should('contain', datasetStatic);
    });
    it('should check that static dataset can be deleted', () => {
        cy.visit('main/intel/all/browse/datasets');
        cy.with(Table)
            .with(TableRow, 'Dataset name', datasetStatic)
            .do(TableRow.selectAction('Delete'));
        cy.with(Modal)
            .with(Clickable, 'Delete')
            .click();
        cy.with(Table).should('not.contain', datasetStatic);
    });
});
