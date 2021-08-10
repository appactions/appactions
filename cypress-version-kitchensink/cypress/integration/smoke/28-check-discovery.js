import { cypressAdmin } from '../../support/constants';
import {
    DetailPane,
    Clickable,
    Notification,
    Search,
    Table,
    TableRow,
    ListHeader,
} from '../../support/high-level-api/testables';
import { createIncomingFeed, runIncomingFeed, purgeIncomingFeed } from '../../support/api/incoming-feeds';
import { Form } from '../../support/high-level-api/testables';

const smokeDiscovery = {
    title: 'Smoke discovery rule',
};

const defaultDiscovery = {
    title: 'TAXII Stand Samples Rule',
};

const query = {
    value: 'sources.name:TAXII Stand Samples AND data.type:indicator',
};

describe('Discovery', () => {
    let feedName;
    before(() => {
        cy.deleteItem(smokeDiscovery.title, 'discovery-tasks');
        cy.deleteItem(defaultDiscovery.title, 'discovery-tasks');
        cy.login(cypressAdmin.username, cypressAdmin.password);

        createIncomingFeed({ transport_configuration }).then(feed => {
            runIncomingFeed(feed);
            cy.log(`This is feedname: ${feed.name}`);
            feedName = feed.name;
        });
    });

    beforeEach(() => {
        cy.reload(true);
    });

    after(() => {
        purgeIncomingFeed(feedName);
    });

    describe('Discovery screen', () => {
        it('should be able to check if discovery page is displayed', () => {
            // Make sure you are on discovery screen
            cy.get('[data-test="top-nav-link-discovery"]').click();
        });
        it('should be able to create discovery rule', () => {
            cy.with(ListHeader).do(ListHeader.activateActionByTitle('Discovery rules'));
            cy.with(ListHeader).do(ListHeader.activateActionByTitle('Create rule'));

            cy.with(DetailPane)
                .with(Form)
                .do(
                    Form.fillAndSubmit({
                        Name: `${smokeDiscovery.title}`,
                        Description: 'Description Smoke',
                        'Search query': `sources.name:"${feedName}"`,
                    }),
                );

            cy.with(Notification)
                .do(Notification.getNotification())
                .should('contain', `Discovery rule created: ${smokeDiscovery.title}`);

            cy.closeNotificationIfOpen();
            cy.closeDetailPaneIfOpen();
        });
        it('should be able to run created discovery rule', () => {
            cy.closeDetailPaneIfOpen();

            cy.with(Table)
                .with(TableRow, 'Rule name', `${smokeDiscovery.title}`)
                .click();

            cy.with(DetailPane).do(DetailPane.selectAction('Run now'));

            cy.with(DetailPane)
                .with(TableRow, 'Status', 'Success')
                .should('exist');

            cy.closeDetailPaneIfOpen();
        });
        it('should be able to create and run discovery rule based on default feed', () => {
            cy.visit('/main/intel/all/discovery');

            // we close any pane opened: we want to have the pane with the form inside, as only pane opened, so then
            // Cypress will select that one
            cy.closeDetailPaneIfOpen();

            cy.with(ListHeader).do(ListHeader.activateActionByTitle('Discovery rules'));
            cy.with(ListHeader).do(ListHeader.activateActionByTitle('Create rule'));

            cy.with(DetailPane)
                .with(Form)
                .do(
                    Form.fill({
                        Name: `${defaultDiscovery.title}`,
                        Description: 'Description Smoke',
                        'Search query': `${query.value}`,
                        'Correlated workspaces': ['Select all options'],
                        'Correlated workspace types': ['Select all options'],
                    }),
                );

            // fillAndSubmit is not working since this is SAVE not SUBMIT
            cy.getByTestId('save').click();

            cy.with(Notification)
                .do(Notification.getNotification())
                .should('contain', `Discovery rule created: ${defaultDiscovery.title}`);

            cy.with(Table)
                .with(TableRow, 'Rule name', defaultDiscovery.title)
                .click();

            cy.with(Clickable, 'Run Now').click();
            // Can not use HLA here because 2 notifications are displayed simultaneously
            cy.getByTestId('notification-message').contains(`Discovery rule created: ${defaultDiscovery.title}`);
        });
    });
});

//

const transport_configuration = {
    basic_authentication_mode: false,
    polling_service_url: 'https://test.taxiistand.com/read-only/services/poll',
    collection_name: 'multi-binding-fixed',
    ssl_authentication_mode: false,
    taxii_version: '1.1',
    verify_ssl: false,
};
