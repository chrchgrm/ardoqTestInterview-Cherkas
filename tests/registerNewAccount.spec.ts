import { test, expect } from '@playwright/test';
import { mainPageSelectors } from '../selectors/mainPageSelectors';
import { registrationSelectors } from '../selectors/registrationSelectors';
import { generateRandomPassword } from '../utils/helpers';
const { urls, userData } = require('../test-data/testData');
const { generateRandomString, generateRandomEmail, generateRandomAddress, generateRandomCountryId } = require('../utils/helpers');

const username = generateRandomString(8);
const email = generateRandomEmail(username);
const password = generateRandomPassword(8);
const address = generateRandomAddress();
const countryId = generateRandomCountryId();

test('TC1: Registering a new account', async ({ page }) => {
  await page.goto(urls.mainPage);
  await expect(page.getByRole('link', { name: mainPageSelectors.automationTestStoreLink })).toBeVisible();
  await expect(page.getByText(mainPageSelectors.fastShippingText)).toBeVisible();
  
  // Click on 'Login or register' link
  await page.getByRole('link', { name: mainPageSelectors.loginOrRegisterLink }).click();

  // Click on 'Continue' button
  await page.getByRole('button', { name: mainPageSelectors.continueButton }).click();

  const registration = registrationSelectors;

  // Fill registration form fields
  await page.locator(registration.firstNameInput).click();
  await page.locator(registration.firstNameInput).fill(userData.newUser.firstName);
  await page.locator(registration.lastNameInput).click();
  await page.locator(registration.lastNameInput).fill(userData.newUser.lastName);
  await page.locator(registration.emailInput).click();
  await page.locator(registration.emailInput).fill(email);
  await page.locator(registration.addressInput).click();
  await page.locator(registration.addressInput).fill(address);
  await page.locator(registration.cityInput).click();
  await page.locator(registration.cityInput).fill(userData.newUser.city);
  await page.locator(registrationSelectors.countryIdSelect).selectOption(String(countryId));

  await page.waitForTimeout(3000); // Pause for 3 seconds

  /*
  const dropdownOptions = await page.$$(registrationSelectors.zoneIdSelect + ' option');
  const numberOfOptions = dropdownOptions.length;
  const randomIndex = generateRandomInteger(1, numberOfOptions - 1); // Adjusted index range
  await dropdownOptions[randomIndex].selectOption({}); 
  */


  await page.locator(registration.zoneIdSelect).selectOption({ index: 1 });
  await page.locator(registration.postcodeInput).click();
  await page.locator(registration.postcodeInput).fill(String(userData.newUser.postCode));
  await page.locator(registration.loginnameInput).click();
  await page.locator(registration.loginnameInput).fill(username);
  await page.locator(registration.passwordInput).click();
  await page.locator(registration.passwordInput).fill(password);
  await page.locator(registration.confirmPasswordInput).click();
  await page.locator(registration.confirmPasswordInput).fill(password);

  // Check the agreement checkbox
  await page.getByLabel(registration.agreementCheckboxLabel).check();

  // Click on 'Continue' button to submit registration
  await page.getByRole('button', { name: registration.createAccountButton }).click();

  // Assert success message
  await expect(page.getByText(registration.successMessage)).toBeVisible();

  // Click on 'Continue' link
  await page.getByRole('link', { name: mainPageSelectors.continueButton }).click();

  // Assert welcome message
  await expect(page.locator(mainPageSelectors.welcomeMessage)).toContainText(`Welcome back ` + userData.newUser.firstName);

});
