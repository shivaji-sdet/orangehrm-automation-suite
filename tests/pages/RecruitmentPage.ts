import { Page, Locator } from '@playwright/test';

export class RecruitmentPage {
  readonly subMenuTabs: Locator;
  readonly addButton: Locator;

  constructor(private readonly page: Page) {
    this.subMenuTabs = page.locator('.oxd-topbar-body-nav-tab');
    this.addButton = page.locator('button:has-text("Add")');
  }

  async navigate() {
    await this.page.goto('/web/index.php/recruitment/viewRecruitmentModule');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
