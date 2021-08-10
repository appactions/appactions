import { FilterPanel, ListHeader, DetailPane } from '../../support/high-level-api/testables';
import { cypressAdmin } from '../../support/constants';

describe.skip('Debug stuff', () => {
    before(() => {
        if (!sessionStorage.getItem('token')) {
            cy.login(cypressAdmin.username, cypressAdmin.password);
        }
    });
    it.only('should display `Source` filters on browse > observables page`', () => {
        cy.visit('/main/intel/all/browse/observable');
        cy.with(ListHeader).do(ListHeader.openFilterPanel());
        cy.get('.filter').should('be.visible');
        cy.with(FilterPanel)
            .contains('Source')
            .should('be.visible');
    });
    it('DetailPane', () => {
        cy.visit('/user-management/groups/?detail=1');
        cy.with(DetailPane).do(DetailPane.close());
    });
});
