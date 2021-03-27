import puppeteer from 'puppeteer';
import expect from 'expect';
import fs from 'fs';

const baseUrl = process.env.REACT_APP_ACTIONS_BASE_URL || 'http://localhost:3000';

export default class Runner {
    constructor({ content, fileName }) {
        this.flow = content;
        this.fileName = fileName;
        this.currentVariant = null;
        this.browser = null;
        this.page = null;
        this.headless = Boolean(process.env.CI);
        this.devtools = Boolean(process.env.DEVTOOLS);
    }

    init = async () => {
        this.browser = await puppeteer.launch({
            headless: this.headless,
            devtools: this.devtools,
            args: [
                `--window-size=1500,1300`,
                `--remote-debugging-address=0.0.0.0`,
                `--remote-debugging-port=9333`,
                // '--wait-for-debugger',
            ],
        });
    };

    startVariant = async variant => {
        const startUrl = `${baseUrl}${this.flow['start']['route']}`;
        console.log('=== running variant:', { variant, startUrl });
        this.currentVariant = variant;
        this.page = await this.browser.newPage();

        this.page.on('console', msg => {
            if (msg.type() === 'info') {
                console.log('[runtime]', msg.text());
            }
        });

        await this.page.evaluateOnNewDocument(
            fs.readFileSync(require.resolve('react-app-actions/dist/runtime.js'), 'utf8'),
        );
        await this.page.evaluateOnNewDocument(() => {
            ReactAppActions.installBackend(window);
        });
        await this.page.setViewport({
            width: 1500,
            height: 1300,
        });
        await this.page.goto(startUrl);
    };

    processStep = async step => {
        if (step.with.role === 'document') {
            if (step.assert) {
                const [pathToActual, matcher, expected] = step.assert;
                const value = await this.page.evaluate(path => ReactAppActions.utils.get(document, path), pathToActual);
                await expect(value)[matcher](expected);
                return true;
            }
        } else {
            return await this.page.evaluate(step => ReactAppActions.dispatch(ReactAppActions.renderer, step), step);
        }
    };

    cleanup = async () => {
        await this.browser.close();
        this.browser = null;

        console.log('done.');
    };

    run = async () => {
        await this.init();
        for await (let [variant, steps] of Object.entries(this.flow['steps'])) {
            await this.startVariant(variant);

            for await (let step of steps) {
                const result = await this.processStep(step);
                if (result === true) {
                    console.log('-', step['with']['role'], step['with']['specifier'] || '', '✓');
                } else {
                    console.log('-', step);
                }
            }

            // leave the browser open in headful mode
            if (!this.headless) {
                await new Promise(() => {});
            }
        }

        await this.cleanup();
    };
}

// async function test(page) {
//     const data = generateData();

//     await page.goto(baseUrl);

//     //     cy.document().its('title').should('eq', 'Restaurant Reviewer');
//     const title = await page.evaluate(() => document.title);
//     await expect(title).toBe('Restaurant Reviewer');

//     let $document = await getDocument(page);

//     //     cy.findByRole('button', { name: 'Sign in' }).click();
//     const button = await findByRole($document, 'button', { name: 'Sign in' });
//     await button.click();
//     //     cy.findByLabelText('Email').type(user.email);
//     await page.waitForSelector('#input-email-for-credentials-provider');
//     $document = await getDocument(page);
//     const email = await findByLabelText($document, 'Email');
//     await email.type(data.user.email);
//     //     cy.findByRole('button', { name: 'Sign in with TestLogin' }).click();

//     const button2 = await findByRole($document, 'button', { name: 'Sign in with TestLogin' });
//     await button2.click();
//     //     cy.findByRole('heading', { name: 'Welcome to Restaurant Reviewer!' }).should('exist');

//     await page.waitForSelector('main h2');
//     $document = await getDocument(page);

//     await findByRole($document, 'heading', { name: 'Welcome to Restaurant Reviewer!' });
//     //     cy.findByLabelText('Restaurant owner').click({ force: true });

//     // const input = await findByLabelText($document, 'Restaurant owner');
//     // await input.click({ force: true });
//     // await input.$eval('input', elem => elem.click());

//     //     cy.findByRole('button', { name: 'Continue' }).click();
//     //     cy.findByRole('link', { name: 'Add new restaurant' }).should('exist');

//     //     cy.findByRole('link', { name: 'Add new restaurant' }).click();
//     //     cy.findByLabelText('Restaurant name').type(restaurant.name);
//     //     cy.findByAltText(`Cover photo ${Math.floor(Math.random() * 4)}`).click();
//     //     cy.findByRole('button', { name: 'Create' }).click();
//     //     cy.findByRole('heading', { name: restaurant.name }).should('exist');
// }
