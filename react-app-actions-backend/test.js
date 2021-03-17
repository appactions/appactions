const puppeteer = require('puppeteer');
const expect = require('expect');
const fs = require('fs');

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

async function test(page) {
    // const title = await page.evaluate(() => document.title);
    // await expect(title).toBe('Restaurant Reviewer');
}

(async () => {
    const browser = await puppeteer.launch({ headless: !!process.env.CI, devtools: true });
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(fs.readFileSync('./dist/index.js', 'utf8'));
    await page.evaluateOnNewDocument(() => {
        ReactAppActions.installBackend(window);
    });

    await page.goto(baseUrl);

    let error;

    try {
        await test(page);
    } catch (e) {
        error = e;
    }

    if (error) {
        console.log('Tests are failing.');
        console.log();
        console.log(error);
        process.exit(1);
    } else {
        console.log('Tests are passing.');
    }

    // leave the browser open in headful mode
    if (!process.env.CI) {
        await new Promise(() => {});
    }

    await browser.close();
})();
