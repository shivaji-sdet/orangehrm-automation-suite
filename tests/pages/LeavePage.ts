import { Page, Locator } from '@playwright/test';

export class LeavePage {
  readonly tableRows: Locator;
  readonly subMenuTabs: Locator;
  readonly searchButton: Locator;

  constructor(private readonly page: Page) {
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.subMenuTabs = page.locator('.oxd-topbar-body-nav-tab');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
  }

  async navigate() {
    await this.page.goto('/web/index.php/leave/viewLeaveModule');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToLeaveList() {
    await this.page.goto('/web/index.php/leave/viewLeaveList');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToApply() {
    await this.page.goto('/web/index.php/leave/applyLeave');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
