import { cypressAdmin, tempUserPassword } from '../../support/constants';
import {
    createInactiveRetentionPolicy,
    createActiveRetentionPolicy,
    createRetentionPolicyWithTypes,
    deleteRetentionPolicy,
} from '../../support/api/retention-policy';
import {
    DetailPane,
    Notification,
    Search,
    Table,
    TableRow,
    Clickable,
    Modal,
} from '../../support/high-level-api/testables';
import { generate } from '../../utils';
import { createUserWithoutPermissions } from '../../support/api/users';

// creation tests
const demoRetentionPolicy = generate.createRetentionPolicy();
// list tests
let retentionPolicyName1;
let retentionPolicyName2;
let retentionPolicyName3;

describe('Retention policy creation', () => {
    describe('Creation, list and detail pane tests', () => {
        before(() => {
            // create list tests data
            createInactiveRetentionPolicy({
                name: `Cypress Retention Policy ${generate.randomNumber()}`,
            }).then(data => {
                retentionPolicyName1 = data.name;
            });

            createActiveRetentionPolicy({
                name: `Cypress Retention Policy ${generate.randomNumber()}`,
            }).then(data => {
                retentionPolicyName2 = data.name;
            });

            createRetentionPolicyWithTypes({
                name: `Cypress Retention Policy ${generate.randomNumber()}`,
            }).then(data => {
                retentionPolicyName3 = data.name;
            });
            // end

            cy.login(cypressAdmin.username, cypressAdmin.password);
        });

        after(() => {
            // clean creation tests data
            cy.deleteItem(demoRetentionPolicy.name, 'retention-policies');
            // clean list tests data
            cy.deleteItem(retentionPolicyName1, 'retention-policies');
            cy.deleteItem(retentionPolicyName2, 'retention-policies');
            cy.deleteItem(retentionPolicyName3, 'retention-policies');
            // clean Detail Pane tests data
            cy.deleteItem(demoRetentionPolicy.name, 'retention-policies');

            // cy.logout();
        });

        beforeEach(() => {
            // create creation tests data
            cy.deleteItem(demoRetentionPolicy.name, 'retention-policies');
            cy.clearWorkInProgress();
            cy.visit('/main/configuration/retention-policies/add');
            cy.waitPageForLoad();
        });

        it.skip('should reach creation form by list action button', () => {
            cy.visit('/main/configuration/retention-policies/');
            cy.getByTestId('list-header-action-create-retention-policy').click();
            cy.waitPageForLoad();
            cy.url().should('include', '/retention-policies/add');
        });
        it('should be possible to create a new retention policy', () => {
            cy.policyFormFillInAllFields(demoRetentionPolicy);

            cy.get('[data-test="save"]')
                .click()
                // giving it the time to apply ui validation
                .wait(1000);

            cy.with(Notification)
                .do(Notification.getNotification())
                .should('contain', 'Retention policy created');
        });
        it.skip('should be possible to open Policy Impact modal as preview ', () => {
            // would make sense to use {createInactiveRetentionPolicy} from '../../../../support/api/retention-policy'
            cy.policyFormFillInAllFields(demoRetentionPolicy);

            // preview matched entities
            cy.with(Clickable, 'Policy impact')
                .click()
                // giving it the time to apply ui validation
                .wait(1000);

            cy.with(Modal).should('be.visible');

            // todo click on the Preview Modal → View matches does open a modal with a table in it
            //  need to set up a retention policy that does target items for the action "Delete entities"
            // cy.with(Modal).do($modal => {
            //     if ($modal.find('.pagination-advanced__total-count').length) {
            //     } else {
            //         cy.log('No mathed entities');
            //     }
            // });
        });
        it('should display the expected columns', () => {
            cy.visit('/main/configuration/retention-policies');
            cy.waitPageForLoad();

            cy.with(Table)
                .do(Table.getColumnLabels())
                // first empty column is for the "select all" checkbox, last one if for the Refresh button
                .should('deep.equal', ['Policy name', 'Enabled', 'Execution schedule', 'Last run', 'Last run status']);
        });
        it('should be possible to open the filters sidebar', () => {
            const expectedFilterGroupsTitles = ['Entity types', 'Observable types', 'Sources', 'Status'];

            cy.visit('/main/configuration/retention-policies');
            cy.waitPageForLoad();

            cy.get('.list-header__toggles .icon-filter')
                .click()
                .wait(500);

            cy.get('.top-nav__content div.filter').then($filter => {
                const filterGroupsList = $filter.find('.filter__group-title');

                filterGroupsList.each((index, filterGroup) => {
                    expect(Cypress.$(filterGroup).text()).to.be.oneOf(expectedFilterGroupsTitles);
                });
            });

            // closing side bar
            cy.get('[data-test="header-filter"').click();
        });
        it('should be possible to select multiple items', () => {
            cy.visit('/main/configuration/retention-policies');
            cy.waitPageForLoad();

            // resetting multiple selection if any
            cy.get('.app__inner').then($inner => {
                const actionBarResetSelectionButton = $inner.find('.action-bar .icon-close');

                if (actionBarResetSelectionButton.length > 0) {
                    actionBarResetSelectionButton.get(0).click();
                }
            });

            cy.with(Table)
                .find('[type="checkbox"]')
                .eq(1)
                .click()
                .wait(1000);

            cy.with(Table)
                .find('[type="checkbox"]')
                .eq(2)
                .click();

            cy.wait(1000);

            cy.get('.action-bar__count').then($count => {
                expect($count.text().replace(/\D+/g, '')).to.contain(2);
            });

            // resetting selection
            cy.get('.action-bar .icon-close').click();
        });
        it('should be possible to find the created policy', () => {
            cy.visit('/main/configuration/retention-policies');
            cy.waitPageForLoad();

            cy.with(Search).do(Search.search(retentionPolicyName1));

            cy.with(Table)
                .with(TableRow, 'Policy name', retentionPolicyName1)
                .should('exist');
        });
        it.skip('should be possible to find on Detail Pane the settings from form', () => {
            // all the keys expected to be displayed on the Detail Pane
            const expectedKeys = [
                'Policy status',
                'Last run',
                'Execution schedule',
                'Deleted items',
                'Targeted items on next run',
                'Created',
                'Last updated',
                'Description',
                'Retention period',
                'Sources',
                'Delete entities',
                'Delete observables',
                'Exclude matches from datasets',
                'Exclude matches from user tasks',
                'Exclude matches from public dashboards',
                'Exclude matches even if master entity',
                'Exclude matches from drafts',
                'Exclude when tagged by',
            ];

            // all the values expected to be displayed on the Detail Pane, that depend from the data filled in in the form,
            // or "static" values (for example, we are not checking the Creation date, which depends on the execution time)
            // todo improve
            const expectedVals = [
                'DISABLED',
                'N/A',
                'Every 1 days.',
                'Total deleted items since the first run:0 entities0 observables',
                // 'Policy impact',
                demoRetentionPolicy.description,
                // jQuery selects the text leaving a space at the beginning
                ' 1000 years after ingestion',
                // jQuery selects the text leaving a space at the beginning
                ' TTP',
                'actor-id',
                'Yes',
                'No',
                'No',
                'No',
                'No',
                // jQuery unifies the two texts in the tag input
                'NonecustomTag',
            ];

            // getting rid of view state
            cy.visit('/main/configuration/retention-policies');
            cy.waitPageForLoad();

            cy.with(Search).do(Search.search(demoRetentionPolicy.name));

            cy.with(Table)
                .with(TableRow, 'Policy name', demoRetentionPolicy.name)
                .click()
                .wait(1000);

            // we check all the keys found on the detail pane with the expected keys list
            cy.get('.detail-pane').then($dp => {
                const allKeysList = $dp.find('th.key-val-table__key');

                allKeysList.each((index, th) => {
                    expect(Cypress.$(th).text()).to.be.oneOf(expectedKeys);
                });
            });

            // we check all the static values found on the detail pane with the expected values list: the static values are
            // a subset of the values found on the detail pane, so we expect some of them to be not matches. we count the
            // total number of matches and we assert that the count is the same as the list lenght
            cy.get('.detail-pane').then($dp => {
                const allKeysList = $dp.find('td.key-val-table__value');
                const valsClone = [].concat(expectedVals);
                let matches = 0;

                allKeysList.each((index, td) => {
                    const text = Cypress.$(td).text();

                    if (valsClone.includes(text)) {
                        // we remove the item just found: this is because some items are repeated, like 'Yes' and 'No'
                        valsClone.splice(valsClone.indexOf(text), 1);
                        matches = matches + 1;
                    }
                });

                expect(matches).to.be.equals(expectedVals.length);
            });

            cy.with(DetailPane).do(DetailPane.close());
        });
        it('should enable policy by Enable button and run it by Run Now button', () => {
            // create data for Detail Pane tests
            cy.visit('/main/configuration/retention-policies/add');
            cy.waitPageForLoad();
            // would make sense to use {createInactiveRetentionPolicy} from '../../../../support/api/retention-policy'
            cy.policyFormFillInAllFields(demoRetentionPolicy);

            cy.get('[data-test="save"]')
                .click()
                // giving it the time to apply ui validation
                .wait(1000);

            cy.with(Notification)
                .do(Notification.getNotification())
                .should('contain', 'Retention policy created');

            cy.closeDetailPaneIfOpen();
            // end

            cy.visit('/main/configuration/retention-policies');
            cy.waitPageForLoad();

            cy.with(Search).do(Search.search(demoRetentionPolicy.name));

            cy.with(Table)
                .with(TableRow, 'Policy name', demoRetentionPolicy.name)
                .click();

            // enabling the retention policy
            // cy.get('.detail-pane')
            //     .should('be.visible')
            //     // we assume (from policyFormFillInAllFields) that the policy is disabled, so "Disable" is expected to be the
            //     // active button and we select the not active one
            //     .get('a.button-group__item:not(.button-group__item--active)')
            //     .click();

            cy.with(DetailPane)
                .with(Clickable, 'Enable')
                .click();

            cy.with(Notification)
                .do(Notification.getNotification())
                .should('contain', 'Retention policy updated');

            cy.get('.detail-pane')
                .getByTestId('run-now')
                .click()
                .wait(500);

            // a confirm should pop up: this is the "Save and run" button from confirm
            cy.get('.confirm [data-test="run"]')
                .click()
                // giving it the time to apply ui validation
                .wait(1000);

            cy.findNotificationByStatusWhenMultipleOnScreen('RUNNING');

            cy.with(DetailPane).do(DetailPane.close());
        });
    });
    describe.skip('Permission modify-retention-policy tests', () => {
        // let's declare a global variable to assert it in the next tests
        let retentionPolicy;
        let retentionPolicyName;

        before(() => {
            cy.login(cypressAdmin.username, cypressAdmin.password);

            //let's create a retention policy
            createInactiveRetentionPolicy({
                name: `Cypress Retention Policy ${generate.randomNumber()}`,
            }).then(data => {
                retentionPolicy = data.id;
                retentionPolicyName = data.name;
            });

            cy.logout();

            // let's create a new non-admin user with modify-retention-policy permission assigned
            const username = generate.userName();
            const password = tempUserPassword;
            const withoutPermissions = ['modify retention-policies'];
            createUserWithoutPermissions({ username, password }, withoutPermissions);
            cy.login(username, password);
        });

        after(() => {
            deleteRetentionPolicy(retentionPolicy);
            cy.logout();
        });

        // user with no 'modify retention-policy' permissions assigned will not be able to edit or delete a retention policy via ActionPicker;
        it('should deny edit action if not assigned to user', () => {
            cy.visit('/main/configuration/retention-policies/');
            cy.waitPageForLoad();
            cy.with(Search).do(Search.search(retentionPolicyName));
            cy.with(Table)
                .with(TableRow, 'Policy name', retentionPolicyName)
                .click();

            cy.with(DetailPane)
                .do(DetailPane.isActionActive('Edit'))
                .should('be.false');

            cy.with(DetailPane)
                .do(DetailPane.isActionActive('Delete'))
                .should('be.false');

            //let's access the edit policy via URL
            cy.visit(`/main/configuration/retention-policies/${retentionPolicy}/edit`);
            cy.waitPageForLoad();

            // user with no 'modify retention-policy' permissions assigned will not be able to edit or delete a retention policy via URL
            // and receive an warning message;
            cy.get('.app__inner .alert').should('have.class', 'alert--error');

            cy.get('.app__inner .alert')
                .invoke('text')
                .then(text => {
                    expect(text).to.contain('Access denied. You are not authorised to access this resource');
                });
        });
        it('should show alert warning to inform about missing permission, for edit', () => {
            cy.visit(`main/configuration/retention-policies/${retentionPolicy}/edit`);
            cy.waitPageForLoad();

            //cy.with(Alert)
            //    .do(Alert.getMessage())
            //    .should('include', 'Access denied. You are not authorised to access this resource');

            cy.get('.app__inner .alert').should('have.class', 'alert--error');

            cy.get('.app__inner .alert')
                .invoke('text')
                .then(text => {
                    expect(text).to.contain('Access denied. You are not authorised to access this resource');
                });
        });
    });
});
