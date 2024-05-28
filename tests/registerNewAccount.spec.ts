import { test, expect, type Page } from '@playwright/test';
import { mainPageSelectors } from '../selectors/mainPageSelectors';
import { commonSelectors } from '../selectors/commonSelectors';
import { registrationSelectors } from '../selectors/registrationSelectors';
import { generateRandomPassword } from '../utils/helpers';
import { myAccountSelectors } from '../selectors/myAccountSelectors';
const { urls, userData, accountData } = require('../test-data/testData');
const { generateRandomString, generateRandomEmail, generateRandomAddress, generateRandomCountryId } = require('../utils/helpers');

const username = generateRandomString(8);
const email = generateRandomEmail(username);
const password = generateRandomPassword(8);
const address = generateRandomAddress();
const countryId = generateRandomCountryId();
const registration = registrationSelectors;
const user = userData.newUser;

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
  await page.locator(registrationSelectors.countryIdSelect).selectOption(String(countryId));

  await page.waitForTimeout(3000); // Pause for 3 seconds

  await page.locator(registration.zoneIdSelect).selectOption({ index: 1 });
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

  // TC2: Verify that the account was created successfully
  await expect(page.locator(mainPageSelectors.welcomeMessage)).toContainText(registration.welocmeBackMessage + user.firstName);
  await page.getByRole('link', { name: myAccountSelectors.accountDashboardButton }).click();
  await expect(page.locator(myAccountSelectors.mainHeader)).toContainText(user.firstName);
  await expect(page.locator(myAccountSelectors.dashTilesRow)).toBeVisible();
  await expect(page.locator(myAccountSelectors.dashTileAddressBook)).toContainText(accountData.newAccount.addressBookNumber);
  await expect(page.locator(myAccountSelectors.dashTileOrderHistory)).toContainText(accountData.newAccount.orderHistoryNumber);
  await expect(page.locator(myAccountSelectors.dashTileDownloads)).toContainText(accountData.newAccount.downloadsNumber);
  await expect(page.locator(myAccountSelectors.dashTileTransactionHistory)).toContainText(accountData.newAccount.transactionHistoryAmount);
});
