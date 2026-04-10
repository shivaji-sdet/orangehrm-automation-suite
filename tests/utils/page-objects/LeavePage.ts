import { Page } from '@playwright/test';

export class LeavePage {
  readonly page: Page;

  readonly selectors = {
    leaveTableRows: '.oxd-table-body .oxd-table-row',
    leaveTypeDropdown: '.oxd-select-text',
    fromDateInput: '.oxd-date-input input',
    commentTextArea: '.oxd-textarea',
    applyButton: 'button[type="submit"]:has-text("Apply")',
    searchButton: 'button[type="submit"]:has-text("Search")',
    resetButton: 'button[type="reset"]:has-text("Reset")',
    recordCount: '.orangehrm-horizontal-padding span',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.locator('.oxd-main-menu-item:has-text("Leave")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToApplyLeave() {
    await this.navigate();
    await this.page.locator('.oxd-topbar-body-nav-tab:has-text("Apply")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToLeaveList() {
    await this.navigate();
    await this.page.locator('.oxd-topbar-body-nav-tab:has-text("Leave List")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async applyLeave(leaveType: string, fromDate: string, toDate: string, comment?: string) {
    await this.page.locator(this.selectors.leaveTypeDropdown).first().click();
    await this.page.locator(`.oxd-select-option:has-text("${leaveType}")`).click();

    const dateInputs = this.page.locator(this.selectors.fromDateInput);
    await dateInputs.first().fill(fromDate);
    await dateInputs.last().fill(toDate);

    if (comment) {
      await this.page.locator(this.selectors.commentTextArea).fill(comment);
    }

    await this.page.locator(this.selectors.applyButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getLeaveCount(): Promise<number> {
    return await this.page.locator(this.selectors.leaveTableRows).count();
  }
}
