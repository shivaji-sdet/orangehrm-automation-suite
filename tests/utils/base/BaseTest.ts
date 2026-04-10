import { test as base, Page } from '@playwright/test';
import { OrangeHRMPage } from '../page-objects/OrangeHRMPage';
import { getEnvironment, getFeatures, getBaseUrl } from '../../fixtures/environments/environment.config';
import { credentialsByUser, UserKey } from '../../e2e/config/auth.credentials';
import * as fs from 'fs';
import * as path from 'path';
import { AUTH_STATES_DIR } from '../../fixtures/global-setup';

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
   * Login with a specific user role. Tries cached auth state first.
   */
  async login(userKey: UserKey = 'admin') {
    const restored = await this.restoreAuthState(userKey);
    if (restored) return;

    const { email, password } = credentialsByUser[userKey];

    if (await this.page.locator('.oxd-main-menu').isVisible()) return;

    await this.page.locator('input[name="username"]').fill(email);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('button[type="submit"]').click();
    await this.page.locator('.oxd-main-menu').waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Backward-compatible alias for login() — logs in as admin.
   */
  async performAuthentication() {
    await this.login('admin');
  }

  /**
   * Restore browser auth state from a cached storageState file.
   * Returns true if successfully restored and still logged in.
   */
  async restoreAuthState(userKey: UserKey): Promise<boolean> {
    const authStatePath = path.join(AUTH_STATES_DIR, `${userKey}.json`);
    if (!fs.existsSync(authStatePath)) return false;

    try {
      const state = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));

      if (state.cookies?.length) {
        await this.page.context().addCookies(state.cookies);
      }

      if (state.origins?.length) {
        const items: { name: string; value: string }[] = [];
        for (const { localStorage } of state.origins) {
          if (localStorage?.length) items.push(...localStorage);
        }
        if (items.length) {
          await this.page.context().addInitScript((storageItems: { name: string; value: string }[]) => {
            for (const { name, value } of storageItems) window.localStorage.setItem(name, value);
          }, items);
        }
      }

      await this.page.goto(getBaseUrl());
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Take a screenshot (respects features.screenshots flag).
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
   * Fill a form field, waiting for it to be visible first.
   */
  async fillField(selector: string, value: string) {
    const el = this.page.locator(selector);
    await el.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
    await el.fill(value);
  }

  /**
   * Click an element, waiting for it to be visible first.
   */
  async click(selector: string) {
    const el = this.page.locator(selector);
    await el.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
    await el.click();
  }

  /**
   * Select an option from an OrangeHRM custom dropdown.
   */
  async selectDropdown(dropdownSelector: string, optionText: string) {
    const dropdown = this.page.locator(dropdownSelector);
    await dropdown.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
    await dropdown.click();
    await this.page.locator(`.oxd-select-option:has-text("${optionText}")`).click();
  }

  /**
   * Type into an OrangeHRM autocomplete field and pick the first suggestion.
   */
  async selectAutocomplete(inputSelector: string, searchText: string) {
    const input = this.page.locator(inputSelector);
    await input.waitFor({ state: 'visible', timeout: this.environment.timeouts.element });
    await input.clear();
    await input.fill(searchText);
    await this.page.locator('.oxd-autocomplete-option').first()
      .waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator('.oxd-autocomplete-option').first().click();
  }

  /**
   * Submit a form and return success/failure based on whether a success indicator appears.
   */
  async submitForm(submitSelector: string, successSelector: string) {
    await this.click(submitSelector);
    try {
      await this.page.waitForSelector(successSelector, {
        timeout: this.environment.timeouts.formSubmission,
      });
      return { success: true };
    } catch {
      const errors = await this.page
        .locator('.oxd-input-field-error-message, .oxd-alert-content-text')
        .allTextContents();
      return { success: false, errors };
    }
  }

  /** Generate a unique string suitable for use in test data. */
  generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Extended Playwright test fixture exposing BaseTest as `baseTest`.
 */
export const test = base.extend<{ baseTest: BaseTest }>({
  baseTest: async ({ page }, use) => {
    await use(new BaseTest(page));
  },
});

export { expect } from '@playwright/test';
