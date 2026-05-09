import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly errorMessage: Locator;
  readonly validationErrors: Locator;

  constructor(private readonly page: Page) {
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.validationErrors = page.locator('.oxd-input-field-error-message');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    // Wait for either the dashboard sidebar (success) or an error message (failure)
    await this.page.locator('.oxd-sidepanel, .oxd-alert-content-text, .oxd-input-field-error-message')
      .first()
      .waitFor({ state: 'visible', timeout: 30000 });
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }
}
