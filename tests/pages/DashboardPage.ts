import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly menu: Locator;
  readonly widgets: Locator;
  readonly quickLaunch: Locator;

  constructor(private readonly page: Page) {
    this.menu = page.locator('.oxd-sidepanel');
    this.widgets = page.locator('.orangehrm-dashboard-widget');
    this.quickLaunch = page.locator('.orangehrm-dashboard-widget-header:has-text("Quick Launch")');
  }

  async navigate() {
    await this.page.goto('/web/index.php/dashboard/index');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickQuickLaunch(name: string) {
    await this.page.locator(`.orangehrm-dashboard-widget-name:has-text("${name}")`).click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
