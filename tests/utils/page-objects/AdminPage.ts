import { Page } from '@playwright/test';

export class AdminPage {
  readonly page: Page;

  readonly selectors = {
    // User Management
    addUserButton: 'button:has-text("Add")',
    userTableRows: '.oxd-table-body .oxd-table-row',

    // Add/Edit User Form
    userRoleDropdown: '.oxd-grid-item:has(.oxd-label:has-text("User Role")) .oxd-select-text',
    employeeNameInput: '.oxd-grid-item:has(.oxd-label:has-text("Employee Name")) .oxd-autocomplete-text-input input',
    statusDropdown: '.oxd-grid-item:has(.oxd-label:has-text("Status")) .oxd-select-text',
    usernameInput: '.oxd-grid-item:has(.oxd-label:has-text("Username")) input.oxd-input',
    passwordInput: '.oxd-grid-item:has(.oxd-label:has-text("Password")) input.oxd-input',
    confirmPasswordInput: '.oxd-grid-item:has(.oxd-label:has-text("Confirm Password")) input.oxd-input',
    saveButton: 'button[type="submit"]:has-text("Save")',

    // Search
    searchUsernameInput: '.oxd-grid-item:has(.oxd-label:has-text("Username")) input.oxd-input',
    searchButton: 'button[type="submit"]:has-text("Search")',
    resetButton: 'button[type="reset"]:has-text("Reset")',

    // Table actions
    deleteIcon: '.bi-trash',
    deleteConfirmButton: 'button:has-text("Yes, Delete")',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.locator('.oxd-main-menu-item:has-text("Admin")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToUserManagement() {
    await this.navigate();
    await this.page.locator('.oxd-topbar-body-nav-tab:has-text("User Management")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToJob(subMenu?: string) {
    await this.navigate();
    await this.page.locator('.oxd-topbar-body-nav-tab:has-text("Job")').click();
    if (subMenu) {
      await this.page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`).click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToOrganization(subMenu?: string) {
    await this.navigate();
    await this.page.locator('.oxd-topbar-body-nav-tab:has-text("Organization")').click();
    if (subMenu) {
      await this.page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`).click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async addUser(userRole: string, employeeName: string, status: string, username: string, password: string) {
    await this.page.locator(this.selectors.addUserButton).click();
    await this.page.waitForLoadState('networkidle');

    await this.page.locator(this.selectors.userRoleDropdown).click();
    await this.page.locator(`.oxd-select-option:has-text("${userRole}")`).click();

    await this.page.locator(this.selectors.employeeNameInput).fill(employeeName);
    await this.page.waitForTimeout(1000);
    const option = this.page.locator('.oxd-autocomplete-option').first();
    if (await option.count() > 0) await option.click();

    await this.page.locator(this.selectors.statusDropdown).click();
    await this.page.locator(`.oxd-select-option:has-text("${status}")`).click();

    await this.page.locator(this.selectors.usernameInput).fill(username);
    await this.page.locator(this.selectors.passwordInput).fill(password);
    await this.page.locator(this.selectors.confirmPasswordInput).fill(password);

    await this.page.locator(this.selectors.saveButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchUser(username: string) {
    await this.page.locator(this.selectors.searchUsernameInput).fill(username);
    await this.page.locator(this.selectors.searchButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getUserCount(): Promise<number> {
    return await this.page.locator(this.selectors.userTableRows).count();
  }

  async deleteUser(rowIndex: number) {
    await this.page.locator(this.selectors.userTableRows).nth(rowIndex).locator(this.selectors.deleteIcon).click();
    await this.page.locator(this.selectors.deleteConfirmButton).click();
    await this.page.waitForLoadState('networkidle');
  }
}
