import { test, expect, type Page } from '@playwright/test';
import { mainPageSelectors } from '../selectors/mainPageSelectors';
import { commonSelectors } from '../selectors/commonSelectors';
import { registrationSelectors } from '../selectors/registrationSelectors';
import { generateRandomPassword } from '../utils/helpers';
import { myAccountSelectors } from '../selectors/myAccountSelectors';
const { urls, userData, accountData } = require('../test-data/testData');
const { generateRandomInteger, generateRandomString, generateRandomEmail, generateRandomAddress, countNumberOfOptions } = require('../utils/helpers');

const username = generateRandomString(8);
const email = generateRandomEmail(username);
const password = generateRandomPassword(8);
const address = generateRandomAddress();
const registration = registrationSelectors;
const user = userData.newUser;
var regionIndex = 1;
var countryIndex = 1;

test.describe.configure({ mode: 'serial' });
let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('TC1: Registering a new account', async ({ page }) => {
  await page.goto(urls.mainPage);
  await expect(page.getByRole('link', { name: mainPageSelectors.automationTestStoreLink })).toBeVisible();
  await expect(page.getByText(mainPageSelectors.fastShippingText)).toBeVisible();
  
  await page.getByRole('link', { name: mainPageSelectors.loginOrRegisterLink }).click();
  await page.getByRole('button', { name: commonSelectors.continueButton }).click();

  // Filling registration form fields
  await page.locator(registration.firstNameInput).click();
  await page.locator(registration.firstNameInput).fill(user.firstName);
  await page.locator(registration.lastNameInput).click();
  await page.locator(registration.lastNameInput).fill(user.lastName);
  await page.locator(registration.emailInput).click();
  await page.locator(registration.emailInput).fill(email);
  await page.locator(registration.addressInput).click();
  await page.locator(registration.addressInput).fill(address);
  await page.locator(registration.cityInput).click();
  await page.locator(registration.cityInput).fill(user.city);

  //Choosing a random value in the Country dropdown
  const optionsNumCountry = await countNumberOfOptions(page, registrationSelectors.countryIdSelect);
  countryIndex = generateRandomInteger(1, optionsNumCountry);
  await page.locator(registration.countryIdSelect).selectOption({ index: countryIndex });

  //Choosing a random value in the Region / State dropdown
  await page.waitForTimeout(3000); 
  const optionsNumRegion = await countNumberOfOptions(page, registration.zoneIdSelect);
  regionIndex = generateRandomInteger(1, optionsNumRegion);
  await page.locator(registration.zoneIdSelect).selectOption({ index: regionIndex });

  await page.locator(registration.postcodeInput).click();
  await page.locator(registration.postcodeInput).fill(String(user.postCode));
  await page.locator(registration.loginnameInput).click();
  await page.locator(registration.loginnameInput).fill(username);
  await page.locator(registration.passwordInput).click();
  await page.locator(registration.passwordInput).fill(password);
  await page.locator(registration.confirmPasswordInput).click();
  await page.locator(registration.confirmPasswordInput).fill(password);

  await page.getByLabel(registration.agreementCheckboxLabel).check();

  await page.getByRole('button', { name: registration.createAccountButton }).click();

  await expect(page.getByText(registration.successMessage)).toBeVisible();

  await page.getByRole('link', { name: commonSelectors.continueButton }).click();

  const cookies = await page.context().cookies();
  await page.context().addCookies(cookies);
  global.authCookies = cookies;
});


test('TC2: - Verify that the account was created successfully and the new user is logged in', async ({ page }) => {
  await page.context().addCookies(global.authCookies);
  await page.goto(urls.accountPage);
  await expect(page.locator(myAccountSelectors.mainHeader)).toContainText(user.firstName);
  await expect(page.locator(myAccountSelectors.dashTilesRow)).toBeVisible();
  await expect(page.locator(myAccountSelectors.dashTileAddressBook)).toContainText(accountData.newAccount.addressBookNumber);
  await expect(page.locator(myAccountSelectors.dashTileOrderHistory)).toContainText(accountData.newAccount.orderHistoryNumber);
  await expect(page.locator(myAccountSelectors.dashTileDownloads)).toContainText(accountData.newAccount.downloadsNumber);
  await expect(page.locator(myAccountSelectors.dashTileTransactionHistory)).toContainText(accountData.newAccount.transactionHistoryAmount);
});
