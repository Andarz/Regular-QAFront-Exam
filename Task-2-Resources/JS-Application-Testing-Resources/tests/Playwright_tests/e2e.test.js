const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3001'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email: "",
    password: "123456",
    confirmPass: "123456",
};

let albumName = "";

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });


    describe("authentication", () => {
        test("Registration with Valid Data", async () => {
            await page.goto(host);
            await page.locator('text=Register').click();
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);
            user.email = `test_${random}@abv.bg`;

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#conf-pass').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register')
                    && response.status() === 200),
                page.click('button[type="submit"]')
            ]);

            let json = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(json.email).toEqual(user.email);
            expect(json.password).toEqual(user.password);
        });

        test("Login with Valid Data", async () => {
            await page.goto(host);
            await page.click('text="Login"');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login')
                    && response.status() == 200),
                page.click('button[type="submit"]')
            ]);

            let json = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(json.email).toEqual(user.email);
            expect(json.password).toEqual(user.password);
        });

        test('Logout from the Application', async () => {
            await page.goto(host);
            await page.click('text="Login"');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout')
                    && response.status() == 204),
                page.click('nav >> text=Logout')
            ]);

            expect(response.ok()).toBeTruthy();

            await page.waitForSelector('nav >> text=Login');

            expect(page.url()).toBe(host + '/');
        });
    });

    describe("navbar", () => {
        test('Navigation for Logged-In User Testing', async () => {
            await page.goto(host);
            await page.click('text="Login"');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Catalog')).toBeVisible();
            await expect(page.locator('nav >> text=Search')).toBeVisible();
            await expect(page.locator('nav >> text=Create Album')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();
        });

        test('Navigation for Guest User Testing', async () => {
            await page.goto(host);

            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Catalog')).toBeVisible();
            await expect(page.locator('nav >> text=Search')).toBeVisible();            
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();
            await expect(page.locator('nav >> text=Create Album')).toBeHidden();
        });
    });

    describe("CRUD", () => {
        test("Create an Album Testing", async () => {
            let random = Math.floor(Math.random() * 10000);
            albumName = `On Every Street_${random}`;

            await page.goto(host);
            await page.click('text="Login"');
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            await page.click('nav >> text=Create Album');
            await page.waitForSelector('form');

            await page.locator('#name').fill(albumName);
            await page.locator('#imgUrl').fill('https://in-sound.ru/upload/iblock/5f7/t9p505bq60jq6wy8ruecpclspfuodvaf.jpg');
            await page.locator('#price').fill('77.00');
            await page.locator('#releaseDate').fill('29 Feb 2024');
            await page.locator('#artist').fill('Dire Straits');
            await page.locator('#genre').fill('Rock');
            await page.locator('.description').fill('Some unrelevant ambient description');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/albums')
                    && response.status() == 200),
                page.click('button[type="submit"]')
            ]);

            expect(response.ok()).toBeTruthy();

            let json = await response.json();

            expect(json.name).toBe(albumName);
            expect(json.imgUrl).toBe('https://in-sound.ru/upload/iblock/5f7/t9p505bq60jq6wy8ruecpclspfuodvaf.jpg');
            expect(json.price).toBe('77.00');
            expect(json.releaseDate).toBe('29 Feb 2024');
            expect(json.artist).toBe('Dire Straits');
            expect(json.genre).toBe('Rock');
            expect(json.description).toBe('Some unrelevant ambient description');
        });

        test("Edit an Album Testing", async () => {
            await page.goto(host);
            await page.locator('text="Login"').click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            await page.locator('text=Search').click();
            await page.waitForSelector('#search-input');
            await page.locator('#search-input').fill(albumName);
            await page.locator('.button-list').click();
            await page.locator('#details').first().click();
            await page.locator('text=Edit').click();
            await page.waitForSelector('form');
            await page.locator('#price').fill("100.00");

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/albums')
                    && response.status() == 200),
                page.click('button[type="submit"]')
            ]);           

            expect(response.ok()).toBeTruthy();

            let json = await response.json();

            expect(json.name).toBe(albumName);
            expect(json.imgUrl).toBe('https://in-sound.ru/upload/iblock/5f7/t9p505bq60jq6wy8ruecpclspfuodvaf.jpg');
            expect(json.price).toBe('100.00');
            expect(json.releaseDate).toBe('29 Feb 2024');
            expect(json.artist).toBe('Dire Straits');
            expect(json.genre).toBe('Rock');
            expect(json.description).toBe('Some unrelevant ambient description');
        });

        test("Delete an Album Testing", async () => {
            await page.goto(host);
            await page.locator('text="Login"').click();
            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            await page.locator('text=Search').click();
            await page.waitForSelector('#search-input');
            await page.locator('#search-input').fill(albumName);
            await page.locator('.button-list').click();
            await page.locator('#details').first().click();

            page.once('dialog', async dialog => {
                await dialog.accept();
            });
            
            let [response] = await Promise.all([
                page.waitForResponse(response => 
                    response.url().includes('/data/albums') && response.status() === 200
                ),
                page.click('//a[text()="Delete"]')
            ]);
            
            expect(response.ok()).toBeTruthy();            
        });
    });
});