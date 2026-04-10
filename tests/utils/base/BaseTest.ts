import { test as base, expect, Page } from '@playwright/test';
import { OrangeHRMPage } from '../page-objects/OrangeHRMPage';
import { getCredentials, getEnvironment, getFeatures, getBaseUrl } from '../../fixtures/environments/environment.config';
import { TestHelpers } from '../helpers/TestHelpers';
import { credentialsByUser, UserKey } from '../../e2e/config/auth.credentials';
import * as fs from 'fs';
import * as path from 'path';
import { AUTH_STATES_DIR } from '../../fixtures/global-setup';

/**
 * Base test class with common functionality and fixtures
 * Provides standardized setup and utilities for all test files
 * 
 * OrangeHRM Automation Suite
 */
export class BaseTest {
  readonly page: Page;
  readonly orangeHRMPage: OrangeHRMPage;
  readonly environment = getEnvironment();
  readonly features = getFeatures();

  constructor(page: Page) {
    this.page = page;
    this.orangeHRMPage = new OrangeHRMPage(page);
  }

  /**
   * Setup OrangeHRM test environment
   */
  async setupOrangeHRMTest() {
    console.log('🔧 Setting up OrangeHRM test environment...');

    await this.orangeHRMPage.navigateTo();

    // Check if already authenticated
    const isAuthenticated = await this.checkIfAlreadyLoggedIn();

    if (!isAuthenticated) {
      console.log('🔐 Authentication required, proceeding with login...');
      await this.page.goto(getBaseUrl());
      await this.performAuthentication();
    } else {
      console.log('✅ Already authenticated, proceeding with test...');
    }

    console.log('✅ OrangeHRM test environment setup completed');
  }

  /**
   * Perform user authentication with username/password login
   */
  async performAuthentication() {
    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Authentication attempt ${attempt}/${maxRetries}`);

        const username = getCredentials().adminUsername || 'Admin';
        const password = getCredentials().adminPassword || 'admin123';

        console.log(`👤 Using username: ${username}`);

        // Take screenshot before starting authentication
        await this.takeScreenshot(`before-authentication-attempt-${attempt}`);
        console.log('📸 Screenshot taken before authentication');

        // Check if we're already logged in
        const isAlreadyLoggedIn = await this.checkIfAlreadyLoggedIn();
        if (isAlreadyLoggedIn) {
          console.log('✅ Already logged in, skipping authentication');
          return;
        }

        // Step 1: Wait for login page to load
        console.log('⏳ Waiting for login page to fully load...');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        console.log('✅ Login page fully loaded');

        // Step 2: Fill username field
        console.log('👤 Filling username field...');
        const usernameField = this.page.locator('input[name="username"]');
        await usernameField.waitFor({ state: 'visible', timeout: 10000 });
        await usernameField.fill(username);
        console.log(`✅ Username filled: ${username}`);

        // Step 3: Fill password field
        console.log('🔒 Filling password field...');
        const passwordField = this.page.locator('input[name="password"]');
        await passwordField.waitFor({ state: 'visible', timeout: 10000 });
        await passwordField.fill(password);
        console.log('✅ Password filled');

        // Step 4: Click Login button
        console.log('🔘 Clicking Login button...');
        const loginButton = this.page.locator('button[type="submit"]');
        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();
        console.log('✅ Login button clicked');

        // Step 5: Wait for authentication to complete
        console.log('⏳ Waiting for authentication to complete...');
        await this.page.waitForTimeout(3000);

        // Step 6: Verify successful authentication
        console.log('🔍 Verifying successful authentication...');
        await this.page.waitForLoadState('networkidle');

        // Check for dashboard elements that indicate successful authentication
        const dashboardElements = [
          '.oxd-main-menu',
          '.oxd-topbar',
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
            const locator = this.page.locator(element);
            if (await locator.count() > 0 && await locator.isVisible()) {
              console.log(`✅ Authentication successful! Found dashboard element: ${element}`);
              authenticationSuccessful = true;
              break;
            }
          } catch (error) {
            // Continue checking other elements
          }
        }

        // Enhanced fallback authentication verification
        if (!authenticationSuccessful) {
          console.log('⚠️ Dashboard elements not found, checking page content...');

          const authVerificationMethods = [
            // Method 1: Check page content
            async () => {
              const bodyText = await this.page.textContent('body') || '';
              return bodyText.length > 100 &&
                !bodyText.includes('Login') &&
                !bodyText.includes('Invalid credentials');
            },

            // Method 2: Check URL
            async () => {
              const currentUrl = this.page.url();
              return currentUrl.includes('dashboard') ||
                currentUrl.includes('index.php') &&
                !currentUrl.includes('login');
            },

            // Method 3: Check for any navigation menu items
            async () => {
              const menuItems = this.page.locator('.oxd-main-menu-item');
              const count = await menuItems.count();
              return count > 0;
            },
          ];

          for (let i = 0; i < authVerificationMethods.length; i++) {
            try {
              const result = await authVerificationMethods[i]();
              if (result) {
                console.log(`✅ Authentication appears successful using verification method ${i + 1}`);
                authenticationSuccessful = true;
                break;
              }
            } catch (error) {
              console.log(`⚠️ Verification method ${i + 1} failed:`, error);
            }
          }
        }

        if (!authenticationSuccessful) {
          await this.takeScreenshot(`authentication-failed-attempt-${attempt}`);
          console.log('📸 Screenshot taken of failed authentication state');

          console.log('🔍 Debug information for this attempt:');
          console.log(`   Current URL: ${this.page.url()}`);
          console.log(`   Page title: ${await this.page.title()}`);

          const bodyText = await this.page.textContent('body') || '';
          console.log(`   Page content preview: ${bodyText.substring(0, 500)}...`);

          lastError = new Error(`Authentication attempt ${attempt} failed - unable to verify successful login`);

          if (attempt < maxRetries) {
            console.log(`⏳ Waiting 3 seconds before retry attempt ${attempt + 1}...`);
            await this.page.waitForTimeout(3000);
            await this.page.reload();
            await this.page.waitForLoadState('networkidle');
            continue;
          }
        } else {
          console.log('🎉 Authentication completed successfully!');
          return;
        }

      } catch (error: any) {
        console.error(`❌ Authentication attempt ${attempt} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetries) {
          console.log(`⏳ Waiting 3 seconds before retry attempt ${attempt + 1}...`);
          await this.page.waitForTimeout(3000);
          await this.page.reload();
          await this.page.waitForLoadState('networkidle');
          continue;
        }
      }
    }

    const errorMessage = lastError ? lastError.message : 'Unknown authentication error';
    throw new Error(`Authentication setup failed after ${maxRetries} attempts: ${errorMessage}`);
  }

  /**
   * Restore browser auth state from cached storageState file
   */
  async restoreAuthState(userKey: UserKey): Promise<boolean> {
    const authStatePath = path.join(AUTH_STATES_DIR, `${userKey}.json`);

    if (!fs.existsSync(authStatePath)) {
      console.log(`⚠️ No cached auth state found for ${userKey}, falling back to full login`);
      return false;
    }

    try {
      const state = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));

      if (state.cookies?.length) {
        await this.page.context().addCookies(state.cookies);
        console.log(`🍪 Restored ${state.cookies.length} cookies for ${userKey}`);
      }

      if (state.origins?.length) {
        const allItems: { name: string; value: string }[] = [];
        for (const { localStorage: items } of state.origins) {
          if (items?.length) allItems.push(...items);
        }
        if (allItems.length) {
          await this.page.context().addInitScript((storageItems: { name: string; value: string }[]) => {
            for (const { name, value } of storageItems) {
              window.localStorage.setItem(name, value);
            }
          }, allItems);
          console.log(`💾 Queued ${allItems.length} localStorage items for ${userKey}`);
        }
      }

      const baseUrl = getBaseUrl();
      await this.page.goto(baseUrl);
      await this.page.waitForLoadState('domcontentloaded');

      console.log(`✅ Auth state restored for ${userKey}`);
      return true;
    } catch (err) {
      console.warn(`⚠️ Failed to restore auth state for ${userKey}:`, err);
      return false;
    }
  }

  /**
   * V2 Authentication with user-specific credentials
   */
  async v2_performAuthentication(userKey: UserKey) {
    const restored = await this.restoreAuthState(userKey);
    if (restored) return;

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Authentication attempt ${attempt}/${maxRetries}`);
        const { email, password } = credentialsByUser[userKey];
        console.log(`👤 Using username: ${email}`);

        await this.takeScreenshot(`before-authentication-attempt-${attempt}`);

        const isAlreadyLoggedIn = await this.checkIfAlreadyLoggedIn();
        if (isAlreadyLoggedIn) {
          console.log('✅ Already logged in, skipping authentication');
          return;
        }

        // Login flow
        console.log('⏳ Waiting for login page to fully load...');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

        const usernameField = this.page.locator('input[name="username"]');
        await usernameField.waitFor({ state: 'visible', timeout: 10000 });
        await usernameField.fill(email);
        console.log(`✅ Username filled: ${email}`);

        const passwordField = this.page.locator('input[name="password"]');
        await passwordField.waitFor({ state: 'visible', timeout: 10000 });
        await passwordField.fill(password);
        console.log('✅ Password filled');

        const loginButton = this.page.locator('button[type="submit"]');
        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();
        console.log('✅ Login button clicked');

        await this.page.waitForTimeout(3000);
        await this.page.waitForLoadState('networkidle');

        // Verify login
        const menuItems = this.page.locator('.oxd-main-menu-item');
        const count = await menuItems.count();

        if (count > 0) {
          console.log('🎉 Authentication completed successfully!');
          return;
        }

        lastError = new Error(`Authentication attempt ${attempt} failed`);

        if (attempt < maxRetries) {
          await this.page.waitForTimeout(3000);
          await this.page.reload();
          await this.page.waitForLoadState('networkidle');
        }

      } catch (error: any) {
        console.error(`❌ Authentication attempt ${attempt} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetries) {
          await this.page.waitForTimeout(3000);
          await this.page.reload();
          await this.page.waitForLoadState('networkidle');
        }
      }
    }

    const errorMessage = lastError ? lastError.message : 'Unknown authentication error';
    throw new Error(`Authentication setup failed after ${maxRetries} attempts: ${errorMessage}`);
  }

  /**
   * Check if user is already logged in
   */
  private async checkIfAlreadyLoggedIn(): Promise<boolean> {
    try {
      // Check for login form elements
      const loginElements = [
        'input[name="username"]',
        'input[name="password"]',
        'button[type="submit"]:has-text("Login")',
      ];

      for (const loginElement of loginElements) {
        try {
          const element = this.page.locator(loginElement);
          if (await element.count() > 0 && await element.isVisible()) {
            console.log('⚠️ Found login form element - not logged in yet');
            return false;
          }
        } catch (error) {
          // Continue checking
        }
      }

      // Check for dashboard elements
      const dashboardElements = [
        '.oxd-main-menu',
        '.oxd-topbar',
        'text="Dashboard"',
      ];

      for (const dashboardElement of dashboardElements) {
        try {
          const element = this.page.locator(dashboardElement);
          if (await element.count() > 0 && await element.isVisible()) {
            console.log('✅ Already logged in - found dashboard element');
            return true;
          }
        } catch (error) {
          // Continue checking
        }
      }

      return false;
    } catch (error) {
      console.log('⚠️ Error checking login status:', error);
      return false;
    }
  }

  /**
   * Take screenshot with environment-aware configuration
   */
  async takeScreenshot(name: string, options?: { fullPage?: boolean }) {
    if (this.features.screenshots) {
      await this.page.screenshot({
        path: `screenshots/${name}.png`,
        fullPage: options?.fullPage ?? true,
      });
    }
  }

  /**
   * Wait with logging
   */
  async waitWithLog(ms: number, reason: string) {
    console.log(`⏳ Waiting ${ms}ms for ${reason}`);
    await this.page.waitForTimeout(ms);
  }

  /**
   * Scroll to element with logging
   */
  async scrollToElement(selector: string) {
    console.log(`📜 Scrolling to element: ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Fill form field with validation
   */
  async fillFieldSafely(selector: string, value: string, fieldName: string) {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
      await element.fill(value);
      console.log(`✅ Filled ${fieldName}: ${value}`);
    } catch (error) {
      console.log(`❌ Failed to fill ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Click element with retry logic
   */
  async clickSafely(selector: string, elementName: string, retries: number = 2) {
    for (let i = 0; i < retries; i++) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
        await element.click();
        console.log(`✅ Clicked ${elementName}`);
        return;
      } catch (error) {
        console.log(`⚠️ Attempt ${i + 1} failed to click ${elementName}:`, error);
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Verify element visibility with timeout
   */
  async verifyElementVisible(selector: string, elementName: string, timeout?: number) {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible({
      timeout: timeout || this.environment.timeouts.element,
    });
    console.log(`✅ Verified ${elementName} is visible`);
  }

  /**
   * Verify text content
   */
  async verifyTextContent(selector: string, expectedText: string, elementName: string) {
    const element = this.page.locator(selector);
    await expect(element).toContainText(expectedText);
    console.log(`✅ Verified ${elementName} contains text: ${expectedText}`);
  }

  /**
   * Handle form submission with comprehensive error checking
   */
  async submitFormSafely(submitButtonSelector: string, successIndicator: string) {
    console.log('📤 Submitting form...');

    await this.clickSafely(submitButtonSelector, 'Submit button');

    try {
      await this.page.waitForSelector(successIndicator, {
        timeout: this.environment.timeouts.formSubmission,
      });
      console.log('✅ Form submitted successfully');
      return { success: true, message: 'Form submitted successfully' };
    } catch (error) {
      const errorMessages = await this.page.locator('.oxd-input-field-error-message, .oxd-alert-content-text').allTextContents();
      if (errorMessages.length > 0) {
        console.log('❌ Form submission errors:', errorMessages);
        return { success: false, errors: errorMessages };
      }
      return { success: false, message: 'Unknown submission error' };
    }
  }

  /**
   * Select OrangeHRM dropdown option
   */
  async selectDropdownOption(dropdownSelector: string, optionText: string) {
    try {
      console.log(`🔽 Selecting "${optionText}" from dropdown...`);

      const dropdown = this.page.locator(dropdownSelector);
      await dropdown.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
      await dropdown.click();
      await this.page.waitForTimeout(500);

      const option = this.page.locator(`.oxd-select-option:has-text("${optionText}")`);
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();

      console.log(`✅ Successfully selected: ${optionText}`);
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.log(`❌ Failed to select dropdown option: ${error}`);
      throw error;
    }
  }

  /**
   * Select OrangeHRM autocomplete option
   */
  async selectAutocompleteOption(inputSelector: string, searchText: string) {
    try {
      console.log(`🔍 Searching for "${searchText}" in autocomplete...`);

      const input = this.page.locator(inputSelector);
      await input.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
      await input.clear();
      await input.fill(searchText);
      await this.page.waitForTimeout(1000);

      const option = this.page.locator('.oxd-autocomplete-option').first();
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();

      console.log(`✅ Selected autocomplete option: ${searchText}`);
    } catch (error) {
      console.log(`❌ Autocomplete selection failed: ${error}`);
      throw error;
    }
  }

  /**
   * Generate unique test ID
   */
  generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Log test step with consistent formatting
   */
  logStep(stepName: string, details?: string) {
    console.log(`🔄 ${stepName}${details ? `: ${details}` : ''}`);
  }

  /**
   * Log success with consistent formatting
   */
  logSuccess(message: string) {
    console.log(`✅ ${message}`);
  }

  /**
   * Log error with consistent formatting
   */
  logError(message: string, error?: any) {
    console.log(`❌ ${message}${error ? `: ${error}` : ''}`);
  }

  /**
   * Log warning with consistent formatting
   */
  logWarning(message: string) {
    console.log(`⚠️ ${message}`);
  }
}

/**
 * Extended Playwright test with BaseTest fixtures
 */
export const test = base.extend<{ baseTest: BaseTest }>({
  baseTest: async ({ page }, use) => {
    const baseTest = new BaseTest(page);
    await use(baseTest);
  },
});

export { expect } from '@playwright/test';
