import { Page, expect } from '@playwright/test';

/**
 * Leave Page Object
 * Handles leave management operations
 * 
 * OrangeHRM Automation Suite
 */
export class LeavePage {
  readonly page: Page;

  readonly selectors = {
    // Leave List
    leaveListHeader: 'h5:has-text("Leave List")',
    leaveTable: '.oxd-table',
    leaveTableRows: '.oxd-table-body .oxd-table-row',

    // Apply Leave
    leaveTypeDropdown: '.oxd-select-text',
    fromDateInput: '.oxd-date-input input',
    toDateInput: '.oxd-date-input input',
    commentTextArea: '.oxd-textarea',
    applyButton: 'button[type="submit"]:has-text("Apply")',

    // Leave Filters
    fromDateFilter: '.oxd-date-input input',
    toDateFilter: '.oxd-date-input input',
    leaveStatusFilter: '.oxd-select-text',
    leaveTypeFilter: '.oxd-select-text',
    searchButton: 'button[type="submit"]:has-text("Search")',
    resetButton: 'button[type="reset"]:has-text("Reset")',

    // Leave actions
    approveButton: 'button:has-text("Approve")',
    rejectButton: 'button:has-text("Reject")',
    cancelButton: 'button:has-text("Cancel")',

    // Record count
    recordCount: '.orangehrm-horizontal-padding span',
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to Leave module
   */
  async navigate() {
    console.log('🧭 Navigating to Leave...');
    await this.page.locator('.oxd-main-menu-item:has-text("Leave")').click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to Leave');
  }

  /**
   * Navigate to Apply Leave page
   */
  async navigateToApplyLeave() {
    await this.navigate();
    await this.page.waitForTimeout(500);

    const applyTab = this.page.locator('.oxd-topbar-body-nav-tab:has-text("Apply")');
    await applyTab.waitFor({ state: 'visible', timeout: 10000 });
    await applyTab.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to Apply Leave page');
  }

  /**
   * Navigate to Leave List
   */
  async navigateToLeaveList() {
    await this.navigate();
    await this.page.waitForTimeout(500);

    const listTab = this.page.locator('.oxd-topbar-body-nav-tab:has-text("Leave List")');
    await listTab.waitFor({ state: 'visible', timeout: 10000 });
    await listTab.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to Leave List');
  }

  /**
   * Apply leave
   */
  async applyLeave(leaveType: string, fromDate: string, toDate: string, comment?: string) {
    console.log(`📋 Applying leave: ${leaveType} from ${fromDate} to ${toDate}`);

    // Select leave type
    const dropdown = this.page.locator(this.selectors.leaveTypeDropdown).first();
    await dropdown.click();
    await this.page.waitForTimeout(500);
    const option = this.page.locator(`.oxd-select-option:has-text("${leaveType}")`);
    await option.click();
    console.log(`✅ Leave type: ${leaveType}`);

    // Fill from date
    const fromDateInput = this.page.locator(this.selectors.fromDateInput).first();
    await fromDateInput.clear();
    await fromDateInput.fill(fromDate);
    await this.page.waitForTimeout(500);
    console.log(`✅ From date: ${fromDate}`);

    // Fill to date
    const toDateInput = this.page.locator(this.selectors.toDateInput).last();
    await toDateInput.clear();
    await toDateInput.fill(toDate);
    await this.page.waitForTimeout(500);
    console.log(`✅ To date: ${toDate}`);

    // Fill comment if provided
    if (comment) {
      const commentField = this.page.locator(this.selectors.commentTextArea);
      await commentField.fill(comment);
      console.log(`✅ Comment: ${comment}`);
    }

    // Click Apply
    const applyBtn = this.page.locator(this.selectors.applyButton);
    await applyBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Leave applied');
  }

  /**
   * Get leave table row count
   */
  async getLeaveCount(): Promise<number> {
    const rows = this.page.locator(this.selectors.leaveTableRows);
    const count = await rows.count();
    console.log(`📊 Leave count: ${count}`);
    return count;
  }
}
