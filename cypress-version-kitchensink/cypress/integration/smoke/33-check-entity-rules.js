import { cypressAdmin } from '../../support/constants';
import {
    Clickable,
    Collapsible,
    DetailPane,
    Dropdown,
    Form,
    Modal,
    Search,
    Section,
    Table,
    TableRow,
} from '../../support/testables';
import { createEntities } from '../../support/api/entities';
import { createGroup } from '../../support/groups/helper';
import generate from '../../support/generate';

describe('Entity rules', () => {
    const entityName = `${generate.randomNumber()}`;
    const entityRuleName = `Cypress entity rule - ${generate.randomNumber()}`;
    const groupName = generate.groupName();

    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        // create new group
        createGroup({ name: groupName }).then(() => {
            createEntities(
                [
                    {
                        title: entityName,
                        type: 'exploit-target',
                    },
                    {
                        title: entityName,
                        type: 'campaign',
                    },
                ],
                groupName,
            );
        });
    });

    beforeEach(() => {
        cy.clearWorkInProgress();
    });

    it('should create entity rule', () => {
        cy
            // Navigate to rules
            .getByTestId('top-nav-select')
            .contains('Intelligence')
            .click()
            .getByTestId('top-nav-select-data-configuration')
            .click()
            .getByTestId('top-nav-link-rules')
            .click()
            // Start entity rule
            .getByTestId('tab-item')
            .contains('Entity')
            .click()
            .getByTestId('list-header-action-create-rule')
            .click();
        cy.with(DetailPane)
            .with(Form)
            .do(Form.fill({ 'Rule name': entityRuleName }));
        cy.with(Dropdown, 'Criteria').do(Dropdown.select('Entity types'));
        cy.with(Collapsible).do(
            Collapsible.fill({
                Types: ['Exploit target', 'Campaign'],
            }),
        );
        cy.with(Dropdown, 'Action').do(Dropdown.select('Add tags'));
        cy.with(Collapsible, 'Add tags').do(
            Collapsible.fill({
                Tags: ['Admiralty Code - Improbable'],
            }),
        );
        cy.with(Clickable, 'Preview rule').click();

        cy.getByTestId('entity-rule-form-preview-modal').should('be.visible');

        cy.with(Modal)
            .find('.modal__header')
            .should('contain', 'The rule targets the following entities');
        cy.with(Modal).do(Modal.close());

        cy.getByTestId('save').click();

        cy.with(Table)
            .with(TableRow, 'Rule name', entityRuleName)
            .should('be.visible');
    });

    it('should run created entity rule', () => {
        cy.server();

        cy.route({
            method: 'POST',
            url: '/private/tasks/*/run',
            status: 201,
        }).as('entityRule');

        cy.with(Table)
            .with(TableRow, 'Rule name', entityRuleName)
            .click();

        cy.with(DetailPane).do(DetailPane.selectAction('Run now'));

        cy.wait('@entityRule');

        cy.with(DetailPane)
            .getByTestId('status')
            .contains(/Running|Success/g);

        cy.with(DetailPane)
            .getByTestId('status')
            .click();
    });

    it('should check that entity rule added tag', () => {
        cy.visit('/search/entity');
        cy.with(Search).do(Search.search(`data.type:"exploit-target" AND meta.title:${entityName}`));
        cy.with(Table)
            .with(TableRow, 'Name', entityName)
            .click();

        cy.with(DetailPane)
            .with(Section, 'Tags')
            .contains('Admiralty Code - Improbable', { timeout: 10000 });
    });
});
