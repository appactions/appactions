import { cypressAdmin } from '../../support/constants';
import { Clickable, Modal, Table, TableRow, ActionPicker } from '../../support/high-level-api/testables';
import generate from '../../support/generate';

describe.skip('incomingFeed', () => {
    const feedName = `Cypress incoming feed-${generate.randomNumber()}`;

    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    describe('Create incoming feed', () => {
        before(() => {
            // To avoid duplication of feed name in case of multiple run of the same test,
            // basically making sure that this specific feed is not present in the platform
            // and remove all it's entities in case I will need to check entities in the next testcase.
            // This can be adjusted by tester/developer according to test needs.
            cy.deleteItem(feedName, 'incoming-feeds');
        });

        it('should create new incoming feed', () => {
            cy.waitPageForLoad();

            cy
                // navigate to main menu
                .getByTestId('top-nav-select')
                .contains('Intelligence')
                .click()
                .getByTestId('top-nav-select-data-configuration')
                .click()
                .waitPageForLoad()
                .getByTestId('list-header-action-create-incoming-feed')
                .click();

            cy.waitPageForLoad();
            cy.server();
            cy.route({ method: 'POST', url: /incoming-feeds/ }).as('incoming-feeds');

            // fill in incoming feed form
            cy.incomingFeedForm(
                feedName,
                'Smoke-Org',
                'D - Not usually reliable',
                'TAXII poll',
                'STIX 1.2',
                'http://hailataxii.com/taxii-data',
                'guest.Abuse_ch',
            );

            cy.with(Clickable, 'Save').click();
            cy.wait('@incoming-feeds').should(xhr => {
                expect(xhr.status).to.equal(201);
            });
        });

        // WARNING: if there are more feeds than the page size (for example, 11 feeds for a 10 items page size), then
        // the feed won't be found! make sure to run this test on a clean box
        it('should find created feed and run it', () => {
            // Run default feed
            cy.visit('main/configuration/incoming-feeds');
            cy.waitPageForLoad();

            cy.server();
            cy.route({ method: 'POST', url: /private\/tasks\/([\d]+)\/run/ }).as('tasks-run');

            cy.with(Table)
                .with(TableRow, 'Feed name', feedName)
                .with(ActionPicker)
                .do(ActionPicker.selectAction('Download now'));

            cy.wait('@tasks-run').should(xhr => {
                expect(xhr.status).to.equal(201);
            });
        });

        // WARNING: if there are more feeds than the page size (for example, 11 feeds for a 10 items page size), then
        // the feed won't be found! make sure to run this test on a clean box
        it('should find and delete created feed (content)', () => {
            cy.visit('main/configuration/incoming-feeds');
            cy.waitPageForLoad();
            cy.with(Table)
                .with(TableRow, 'Feed name', feedName)
                .with(ActionPicker)
                .do(ActionPicker.selectAction('Delete'));

            cy.server();
            cy.route({ method: 'DELETE', url: /incoming-feeds/ }).as('incoming-feeds');

            cy.with(Modal)
                .with(Clickable, 'Delete')
                .click();

            cy.wait('@incoming-feeds').should(xhr => {
                expect(xhr.status).to.equal(201);
            });
        });

        // WARNING: if there are more feeds than the page size (for example, 11 feeds for a 10 items page size), then
        // the feed won't be found! make sure to run this test on a clean box
        it('should find and delete created feed (content and configuration)', () => {
            cy.visit('main/configuration/incoming-feeds');
            cy.waitPageForLoad();
            cy.with(Table)
                .with(TableRow, 'Feed name', feedName)
                .with(ActionPicker)
                .do(ActionPicker.selectAction('Delete'));

            cy.server();
            cy.route({ method: 'DELETE', url: /incoming-feeds/ }).as('incoming-feeds');

            cy.with(Modal)
                .find('label:contains("Delete Feed Content and Configuration")')
                .click();
            cy.with(Modal)
                .with(Clickable, 'Delete')
                .click();

            cy.wait('@incoming-feeds').should(xhr => {
                expect(xhr.status).to.equal(201);
            });

            cy.with(Table)
                .with(TableRow, 'Feed name', feedName)
                .should('not.exist');
        });
    });
});
