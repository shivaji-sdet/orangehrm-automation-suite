import { Page, Locator } from '@playwright/test';

export class AdminPage {
  readonly tableRows: Locator;
  readonly addButton: Locator;

  constructor(private readonly page: Page) {
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.addButton = page.locator('button:has-text("Add")');
  }

  async navigate() {
    await this.page.goto('/web/index.php/admin/viewAdminModule');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToSubMenu(menu: string, subMenu?: string) {
    await this.page.locator(`.oxd-topbar-body-nav-tab:has-text("${menu}")`).click({ timeout: 30000 });
    if (subMenu) {
      await this.page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`).click();
    }
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchByUsername(username: string) {
    await this.page.fill('.oxd-grid-item:has(.oxd-label:has-text("Username")) input', username);
    await this.page.locator('button[type="submit"]:has-text("Search")').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getRowCount() {
    return this.tableRows.count();
  }
}
