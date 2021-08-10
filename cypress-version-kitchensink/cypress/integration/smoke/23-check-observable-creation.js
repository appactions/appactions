import { cypressAdmin } from '../../support/constants';
import { DetailPane, Form, Search, Table, TableRow, Clickable, Input } from '../../support/testables';
import generate from '../../support/generate';

describe('observable creation', () => {
    const observableValue = generate.randomIpv4();
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
    });

    it('should be able to open observable form, from left panel', () => {
        cy.get('[data-test="nav-panel-item"] .icon-plus')
            .trigger('mouseover')
            .get('.dropdown__option')
            .contains('Observable')
            .wait(500)
            .click();

        cy.with(DetailPane)
            .find('form')
            .should('exist');
        cy.closeDetailPaneIfOpen();
    });

    it('should be able to create an observable with only mandatory fields filled in', () => {
        cy.server();

        cy.route({
            method: 'POST',
            url: '**/private/entities/',
            status: 201,
        }).as('myObservable');

        cy.get('[data-test="nav-panel-item"] .icon-plus')
            .trigger('mouseover')
            .get('.dropdown__option')
            .contains('Observable')
            .wait(500)
            .click();

        cy.with(DetailPane)
            .with(Form)
            .do(
                Form.fill({
                    Type: 'Ipv4',
                    'Value(s)': observableValue,
                    Maliciousness: 'Malicious - High confidence',
                }),
            );

        cy.with(Input, 'Source').do(Input.fill('Testing Group'));

        cy.with(DetailPane)
            .with(Clickable, 'Save')
            .click();

        cy.wait('@myObservable');
        cy.closeDetailPaneIfOpen();
    });
    it('should be able to find created observable', () => {
        cy.visit('main/intel/all/browse/observable');

        cy.closeDetailPaneIfOpen();
        cy.with(Search).do(Search.search(`value:"${observableValue}" AND kind:"ipv4"`));

        cy.with(Table)
            .with(TableRow, 'Value', observableValue)
            .click();

        cy.with(DetailPane)
            .do(DetailPane.getTitle())
            .should('be.equal', `ipv4: ${observableValue}`);
    });
});
