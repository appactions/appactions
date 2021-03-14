const puppeteer = require('puppeteer');
const faker = require('faker');
const expect = require('expect');
const { getDocument, queries, waitFor } = require('pptr-testing-library');

const { findByRole, findByLabelText, findByAltText, getByLabelText } = queries;

const baseUrl = process.env.PUPPETEER_BASE_URL || 'http://localhost:3000';

function generateData() {
    return {
        user: {
            email: `regular_${faker.random.number()}@miklos.dev`,
            password: faker.internet.password(),
        },
        restaurant: {
            name: faker.company.companyName(),
        },
    };
}

async function test(page) {
    const data = generateData();

    await page.goto(baseUrl);

    //     cy.document().its('title').should('eq', 'Restaurant Reviewer');
    const title = await page.evaluate(() => document.title);
    await expect(title).toBe('Restaurant Reviewer');

    let $document = await getDocument(page);

    //     cy.findByRole('button', { name: 'Sign in' }).click();
    const button = await findByRole($document, 'button', { name: 'Sign in' });
    await button.click();
    //     cy.findByLabelText('Email').type(user.email);
    await page.waitForSelector('#input-email-for-credentials-provider');
    $document = await getDocument(page);
    const email = await findByLabelText($document, 'Email');
    await email.type(data.user.email);
    //     cy.findByRole('button', { name: 'Sign in with TestLogin' }).click();

    const button2 = await findByRole($document, 'button', { name: 'Sign in with TestLogin' });
    await button2.click();
    //     cy.findByRole('heading', { name: 'Welcome to Restaurant Reviewer!' }).should('exist');

    await page.waitForSelector('main h2');
    $document = await getDocument(page);

    await findByRole($document, 'heading', { name: 'Welcome to Restaurant Reviewer!' });
    //     cy.findByLabelText('Restaurant owner').click({ force: true });

    // const input = await findByLabelText($document, 'Restaurant owner');
    // await input.click({ force: true });
    // await input.$eval('input', elem => elem.click());

    //     cy.findByRole('button', { name: 'Continue' }).click();
    //     cy.findByRole('link', { name: 'Add new restaurant' }).should('exist');

    //     cy.findByRole('link', { name: 'Add new restaurant' }).click();
    //     cy.findByLabelText('Restaurant name').type(restaurant.name);
    //     cy.findByAltText(`Cover photo ${Math.floor(Math.random() * 4)}`).click();
    //     cy.findByRole('button', { name: 'Create' }).click();
    //     cy.findByRole('heading', { name: restaurant.name }).should('exist');
}

(async () => {
    const browser = await puppeteer.launch({ headless: !!process.env.CI });
    const page = await browser.newPage();

    let error;

    try {
        await test(page);
    } catch (e) {
        error = e;
    }

    await browser.close();

    if (error) {
        console.log('Tests are failing.');
        console.log();
        console.log(error);
        process.exit(1);
    } else {
        console.log('Tests are passing.');
    }
})();
