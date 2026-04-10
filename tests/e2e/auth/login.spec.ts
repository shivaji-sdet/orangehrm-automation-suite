import { test, expect } from '../../utils/base/BaseTest';
import { AuthTestDataFactory } from '../../utils/test-data/AuthTestData';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * Test Suite: User Authentication
 * 
 * This test suite validates the user authentication workflow:
 * 1. Navigate to login page
 * 2. Enter username and password
 * 3. Click Login button
 * 4. Verify successful authentication
 * 5. Verify dashboard access
 */
test.describe('User Authentication - Login Workflow', () => {

  /**
   * Test Case: Successful Login with Valid Credentials
   * 
   * Objective: Verify that a user can successfully authenticate
   * using valid admin credentials.
   */
  test('Successful Login with Valid Credentials @smoke', async ({ baseTest }) => {

    // Get authentication credentials from test data
    const authCredentials = AuthTestDataFactory.getAuthCredentials();

    console.log('🎯 Starting User Login Test');
    console.log(`👤 Using username: ${authCredentials.username}`);
    console.log(`🌍 Environment: ${authCredentials.environment}`);

    // Step 1: Navigate to authentication interface
    await test.step('Navigate to authentication interface', async () => {
      console.log('🧭 Navigating to authentication interface...');
      await baseTest.page.goto(getBaseUrl() || '');
      await baseTest.page.waitForLoadState('domcontentloaded');
      console.log('✅ Successfully navigated to authentication interface');
    });

    // Step 2: Perform complete authentication using BaseTest method
    await test.step('Perform complete authentication', async () => {
      console.log('🔐 Starting complete authentication process...');
      await baseTest.performAuthentication();
      console.log('✅ Complete authentication process finished');
    });

    // Step 3: Verify successful authentication completion
    await test.step('Verify successful authentication completion', async () => {
      console.log('🔍 Verifying successful authentication completion...');

      await baseTest.takeScreenshot('authentication-completed');

      // Check for dashboard elements that indicate successful authentication
      const dashboardElements = [
        '.oxd-main-menu',
        'text="Dashboard"',
        'text="PIM"',
        'text="Leave"',
        'text="Time"',
        'text="Recruitment"',
        'text="Admin"',
      ];

      let authenticationSuccessful = false;
      for (const element of dashboardElements) {
        try {
          const locator = baseTest.page.locator(element);
          if (await locator.count() > 0 && await locator.isVisible()) {
            console.log(`✅ Authentication successful! Found dashboard element: ${element}`);
            authenticationSuccessful = true;
            break;
          }
        } catch (error) {
          // Continue checking other elements
        }
      }

      if (!authenticationSuccessful) {
        console.log('⚠️ Dashboard elements not found, checking page content...');
        const bodyText = await baseTest.page.textContent('body') || '';
        if (bodyText.length > 100 && !bodyText.includes('Login') && !bodyText.includes('Invalid credentials')) {
          console.log('✅ Authentication appears successful based on page content');
          authenticationSuccessful = true;
        }
      }

      expect(authenticationSuccessful, 'User authentication should be successful').toBe(true);
      console.log('🎉 User Login Test COMPLETED SUCCESSFULLY!');
      console.log('✅ User authentication completed successfully');
      console.log('✅ Dashboard access verified successfully');
    });
  });

  /**
   * Test Case: Login with Invalid Credentials
   * 
   * Objective: Verify that login fails with invalid credentials
   * and proper error message is displayed.
   */
  test('Login with Invalid Credentials @smoke', async ({ baseTest }) => {

    const invalidCreds = AuthTestDataFactory.getInvalidCredentials();

    console.log('🎯 Starting Invalid Login Test');

    // Step 1: Navigate to login page
    await test.step('Navigate to login page', async () => {
      console.log('🧭 Navigating to login page...');
      await baseTest.page.goto(getBaseUrl());
      await baseTest.page.waitForLoadState('domcontentloaded');
      await baseTest.page.waitForTimeout(2000);
      console.log('✅ Login page loaded');
    });

    // Step 2: Enter invalid credentials
    await test.step('Enter invalid credentials', async () => {
      console.log('❌ Entering invalid credentials...');

      const usernameField = baseTest.page.locator('input[name="username"]');
      await usernameField.waitFor({ state: 'visible', timeout: 10000 });
      await usernameField.fill(invalidCreds.invalidUsername);

      const passwordField = baseTest.page.locator('input[name="password"]');
      await passwordField.fill(invalidCreds.invalidPassword);

      console.log(`✅ Entered username: ${invalidCreds.invalidUsername}`);
      console.log('✅ Entered invalid password');
    });

    // Step 3: Click Login button
    await test.step('Click Login button', async () => {
      console.log('🔘 Clicking Login button...');
      const loginButton = baseTest.page.locator('button[type="submit"]');
      await loginButton.click();
      await baseTest.page.waitForTimeout(2000);
      console.log('✅ Login button clicked');
    });

    // Step 4: Verify error message
    await test.step('Verify error message displayed', async () => {
      console.log('🔍 Verifying error message...');

      const errorMessage = baseTest.page.locator('.oxd-alert-content-text');
      await errorMessage.waitFor({ state: 'visible', timeout: 10000 });
      const errorText = await errorMessage.textContent();

      expect(errorText).toContain('Invalid credentials');
      console.log(`✅ Error message verified: ${errorText}`);

      await baseTest.takeScreenshot('invalid-login-error');
      console.log('🎉 Invalid Login Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Login with Empty Credentials
   */
  test('Login with Empty Credentials @smoke', async ({ baseTest }) => {

    console.log('🎯 Starting Empty Credentials Login Test');

    // Step 1: Navigate to login page
    await test.step('Navigate to login page', async () => {
      await baseTest.page.goto(getBaseUrl());
      await baseTest.page.waitForLoadState('domcontentloaded');
      await baseTest.page.waitForTimeout(2000);
    });

    // Step 2: Click Login without entering credentials
    await test.step('Click Login without credentials', async () => {
      const loginButton = baseTest.page.locator('button[type="submit"]');
      await loginButton.click();
      await baseTest.page.waitForTimeout(1000);
    });

    // Step 3: Verify required field validation
    await test.step('Verify required field validation', async () => {
      console.log('🔍 Verifying required field validation...');

      const requiredErrors = baseTest.page.locator('.oxd-input-field-error-message');
      const errorCount = await requiredErrors.count();

      expect(errorCount).toBeGreaterThan(0);
      console.log(`✅ Found ${errorCount} required field validation messages`);

      await baseTest.takeScreenshot('empty-credentials-validation');
      console.log('🎉 Empty Credentials Test COMPLETED SUCCESSFULLY!');
    });
  });
});
