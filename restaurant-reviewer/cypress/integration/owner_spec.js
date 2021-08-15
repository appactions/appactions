let user;
let restaurant;

describe('Owner flow', () => {
    before(() => {
        cy.task('freshUser').then(freshUser => {
            user = freshUser;
        });
        cy.task('freshRestaurant').then(freshRestaurant => {
            restaurant = freshRestaurant;
        });
        cy.visit('/');
    });

    it.only('title', () => {
        cy.log('user', user);
        cy.document().its('title').should('eq', 'Restaurant Reviewer');
    });

    it('auth', () => {
        cy.findByRole('button', { name: 'Sign in' }).click();
        cy.findByLabelText('Email').type(user.email);
        cy.findByRole('button', { name: 'Sign in with TestLogin' }).click();
        cy.findByRole('heading', { name: 'Welcome to Restaurant Reviewer!' }).should('exist');
    });

    it('onboarding', () => {
        cy.findByLabelText('Restaurant owner').click({ force: true });
        cy.findByRole('button', { name: 'Continue' }).click();
        cy.findByRole('link', { name: 'Add new restaurant' }).should('exist');
    });
    it('add new restaurant', () => {
        cy.findByRole('link', { name: 'Add new restaurant' }).click();
        cy.findByLabelText('Restaurant name').type(restaurant.name);
        cy.findByAltText(`Cover photo ${Math.floor(Math.random() * 4)}`).click();
        cy.findByRole('button', { name: 'Create' }).click();
        cy.findByRole('heading', { name: restaurant.name }).should('exist');
    });
});
