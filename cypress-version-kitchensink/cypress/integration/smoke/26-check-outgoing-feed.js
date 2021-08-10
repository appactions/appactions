import { cypressAdmin } from '../../support/constants';
import {
    Table,
    TableRow,
    DetailPane,
    Modal,
    Clickable,
    ActionPicker,
    Form,
} from '../../support/high-level-api/testables';
import { API_URL } from '../../support/commands';
import { createGroup } from '../../support/groups/helper';
import { fetchSourceIdsByNames } from '../../support/api/sources';
import { createEntity } from '../../support/api/entities';
import generate, { randomNumber } from '../../support/generate';
import apiConnect from '../../support/api/api-connect';

const intelSet = {
    set: `cypress_set_${randomNumber()}`,
};

const workSpace = {
    set: `cypress_workspace_${randomNumber()}`,
};

describe('outgoingFeed', () => {
    let workspaceId;
    let entityId;
    let groupId;
    let datasetId;
    let datasetName;
    let groupName;
    const outgoingFeedName = `Cypress generated outgoing feed - ${randomNumber()}`;
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.wait(2000);
        // Generate all items for test using api calls
        createGroup()
            .then(group => {
                groupId = group.id;
                cy.log('This is group id: ', groupId);
                groupName = group.name;
                cy.log('This is group name: ', groupName);
                fetchSourceIdsByNames([group.name])
                    .then(ids =>
                        createEntity({
                            data: {
                                title: `out_f_${generate.uid()}`,
                            },
                            sources: [
                                {
                                    source_id: `${ids[0]}`,
                                },
                            ],
                        }),
                    )
                    .its('body.data')
                    .then(entity => {
                        entityId = entity.id;
                        cy.log(`Created entity id: ${entity.id}`);
                        cy.log('Check group object', group);
                    });
            })
            .then(() => {
                createWorkspace(`${workSpace.set}`)
                    .its('body.data')
                    .then(workspace => {
                        workspaceId = workspace.id;
                        cy.log('This is workspaceID: ', workspaceId);
                    })
                    .then(() => {
                        createDataset(`${intelSet.set}`, `${workspaceId}`, `sources.name:"${groupName}"`)
                            .its('body.data')
                            .then(set => {
                                datasetId = set.id;
                                datasetName = set.name;
                            });
                    });
            });
    });

    after(() => {
        apiConnect(cypressAdmin).delete(`entities/${entityId}`);
        apiConnect(cypressAdmin).delete(`groups/${groupId}`);
        apiConnect(cypressAdmin).delete(`workspaces/${workspaceId}`);
        apiConnect(cypressAdmin).delete(`intel-sets/${datasetId}`);
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Create Outgoing feed', () => {
        before(() => {
            // To avoid duplication of feed name in case of multiple run of the same test,
            // basically making sure that this specific feed is not present in the platform
            // and remove all it's entities in case I will need to check entities in the next testcase.
            // This can be adjusted by tester/developer according to test needs.
            cy.deleteItem(outgoingFeedName, 'outgoing-feeds');
        });
        it('should create new Outgoing feed', () => {
            // navigate to main menu
            cy.get('[data-test="top-nav-select"]')
                .contains('Intelligence')
                .click()
                .getByTestId('top-nav-select-data-configuration')
                .click()
                .getByTestId('top-nav-link-outgoing-feeds')
                .click()
                .waitPageForLoad()
                .getByTestId('list-header-action-create-outgoing-feed')
                .click();

            cy.with(Form).do(
                Form.fill({
                    'Feed name': outgoingFeedName,
                    'Transport type': 'HTTP download',
                    'Content type': 'Company JSON',
                    Datasets: [datasetName],
                    'Update strategy': 'REPLACE',
                    'Source reliability filter': 'A - Completely reliable',
                    'Filter TLP': 'Green',
                }),
            );
            cy.get('[data-test="transport_configuration[is_public]"] :checkbox')
                .check({ force: true })
                .should('be.checked');
            cy.with(Clickable, 'Save').click();
        });
        it('should find created feed and run it', () => {
            cy.visit('main/configuration/outgoing-feeds?order=desc&sort=last_updated_at');
            cy.wait(5000);
            cy.with(Table)
                .find('tr')
                .eq(1)
                .then($row => {
                    cy.wrap($row)
                        .with(ActionPicker)
                        .do(ActionPicker.selectAction('Run Now'));
                    cy.wrap($row)
                        .find('td')
                        .eq(1)
                        .children()
                        .contains('Success');
                });
        });
        it('should check created content', () => {
            cy.visit('main/configuration/outgoing-feeds?order=desc&sort=last_updated_at');
            cy.with(Table)
                .with(TableRow, 'Feed name', outgoingFeedName)
                .click();
            cy.with(DetailPane).do(DetailPane.visitTab('Created Packages'));
            cy.with(DetailPane).contains('You can download the latest package from:');
            cy.with(DetailPane).contains('Links to the packages of the latest run:');
            cy.with(DetailPane).contains('Links to all packages in this feed:');
            cy.with(DetailPane).contains(
                'You can download the first package from the latest run of the outgoing feed via URL:',
            );
            cy.with(DetailPane).contains(
                'Replace number 1 at the end of the URL with specific package number to download that package',
            );
            cy.with(DetailPane).contains('You need to be authenticated to perform a download');
            cy.with(DetailPane)
                .getByTestId('download')
                .contains('.json');
        });
        it('should find and delete created feed', () => {
            cy.visit('main/configuration/outgoing-feeds?order=desc&sort=last_updated_at');
            cy.wait(3000);
            cy.closeDetailPaneIfOpen();
            cy.with(Table)
                .find('tr')
                .eq(1)
                .then($row => {
                    cy.wrap($row)
                        .with(ActionPicker)
                        .do(ActionPicker.selectAction('Delete'));
                    cy.with(Modal)
                        .with(Clickable, 'Delete')
                        .click();
                });
        });
    });
});

function createDataset(name, workspace, query) {
    cy.wait(1000);
    const token = sessionStorage.getItem('token');
    return cy.request({
        method: 'POST',
        url: `${API_URL}/intel-sets/`,
        auth: {
            bearer: token,
        },
        body: { data: { name: `${name}`, is_dynamic: true, workspaces: [workspace], search_query: `${query}` } },
    });
}

function createWorkspace(name) {
    cy.wait(1000);
    const token = sessionStorage.getItem('token');
    return cy.request({
        method: 'POST',
        url: `${API_URL}/workspaces/`,
        auth: {
            bearer: token,
        },
        body: { data: { name: `${name}` } },
    });
}
