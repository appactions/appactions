import { cypressAdmin } from '../../support/constants';

export const API_URL = Cypress.env('BASE_URL').trim();

describe('system manifest', () => {
    before(() => {
        cy.login(cypressAdmin.username, cypressAdmin.password);
        cy.clearWorkInProgress();
    });
    after(() => {
        cy.logout();
    });
    context('check system status', () => {
        it('should be able to check if api and ui manifest are set', () => {
            cy.request(`${API_URL}/versions`).then(response => {
                expect(response.body.data).to.have.a.property('platform-api');
                expect(response.body.data).to.have.a.property('platform-database');
            });
            // TODO find a solution
        });
    });
});
