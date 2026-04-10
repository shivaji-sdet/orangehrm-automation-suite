import { Page, expect } from '@playwright/test';

/**
 * Admin Page Object
 * Handles admin module operations (User Management, Job, Organization)
 * 
 * OrangeHRM Automation Suite
 */
export class AdminPage {
  readonly page: Page;

  readonly selectors = {
    // User Management
    systemUsersHeader: 'h5:has-text("System Users")',
    addUserButton: 'button:has-text("Add")',
    userTable: '.oxd-table',
    userTableRows: '.oxd-table-body .oxd-table-row',

    // Add/Edit User Form
    userRoleDropdown: '.oxd-grid-item:has(.oxd-label:has-text("User Role")) .oxd-select-text',
    employeeNameInput: '.oxd-grid-item:has(.oxd-label:has-text("Employee Name")) .oxd-autocomplete-text-input input',
    statusDropdown: '.oxd-grid-item:has(.oxd-label:has-text("Status")) .oxd-select-text',
    usernameInput: '.oxd-grid-item:has(.oxd-label:has-text("Username")) input.oxd-input',
    passwordInput: '.oxd-grid-item:has(.oxd-label:has-text("Password")) input.oxd-input',
    confirmPasswordInput: '.oxd-grid-item:has(.oxd-label:has-text("Confirm Password")) input.oxd-input',
    saveButton: 'button[type="submit"]:has-text("Save")',
    cancelButton: 'button[type="button"]:has-text("Cancel")',

    // Search filters
    searchUsernameInput: '.oxd-grid-item:has(.oxd-label:has-text("Username")) input.oxd-input',
    searchUserRoleDropdown: '.oxd-grid-item:has(.oxd-label:has-text("User Role")) .oxd-select-text',
    searchStatusDropdown: '.oxd-grid-item:has(.oxd-label:has-text("Status")) .oxd-select-text',
    searchButton: 'button[type="submit"]:has-text("Search")',
    resetButton: 'button[type="reset"]:has-text("Reset")',

    // Table actions
    editIcon: '.bi-pencil-fill',
    deleteIcon: '.bi-trash',
    deleteConfirmButton: 'button:has-text("Yes, Delete")',
    deleteCancelButton: 'button:has-text("No, Cancel")',

    // Record count
    recordCount: '.orangehrm-horizontal-padding span',
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to Admin module
   */
  async navigate() {
    console.log('🧭 Navigating to Admin...');
    await this.page.locator('.oxd-main-menu-item:has-text("Admin")').click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to Admin');
  }

  /**
   * Navigate to User Management
   */
  async navigateToUserManagement() {
    await this.navigate();
    await this.page.waitForTimeout(500);

    const userMgmtTab = this.page.locator('.oxd-topbar-body-nav-tab:has-text("User Management")');
    await userMgmtTab.waitFor({ state: 'visible', timeout: 10000 });
    await userMgmtTab.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to User Management');
  }

  /**
   * Navigate to Job sub-menu
   */
  async navigateToJob(subMenu?: string) {
    await this.navigate();
    await this.page.waitForTimeout(500);

    const jobTab = this.page.locator('.oxd-topbar-body-nav-tab:has-text("Job")');
    await jobTab.click();

    if (subMenu) {
      await this.page.waitForTimeout(300);
      const subMenuItem = this.page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`);
      await subMenuItem.click();
    }

    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to Job${subMenu ? ` > ${subMenu}` : ''}`);
  }

  /**
   * Navigate to Organization sub-menu
   */
  async navigateToOrganization(subMenu?: string) {
    await this.navigate();
    await this.page.waitForTimeout(500);

    const orgTab = this.page.locator('.oxd-topbar-body-nav-tab:has-text("Organization")');
    await orgTab.click();

    if (subMenu) {
      await this.page.waitForTimeout(300);
      const subMenuItem = this.page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`);
      await subMenuItem.click();
    }

    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to Organization${subMenu ? ` > ${subMenu}` : ''}`);
  }

  /**
   * Add a new system user
   */
  async addUser(userRole: string, employeeName: string, status: string, username: string, password: string) {
    console.log(`👤 Adding system user: ${username}`);

    // Click Add button
    const addBtn = this.page.locator(this.selectors.addUserButton);
    await addBtn.click();
    await this.page.waitForLoadState('networkidle');

    // Select User Role
    const roleDropdown = this.page.locator(this.selectors.userRoleDropdown);
    await roleDropdown.click();
    await this.page.locator(`.oxd-select-option:has-text("${userRole}")`).click();
    console.log(`✅ User role: ${userRole}`);

    // Fill Employee Name (autocomplete)
    const empNameInput = this.page.locator(this.selectors.employeeNameInput);
    await empNameInput.fill(employeeName);
    await this.page.waitForTimeout(1000);
    const option = this.page.locator('.oxd-autocomplete-option').first();
    if (await option.count() > 0) {
      await option.click();
    }
    console.log(`✅ Employee name: ${employeeName}`);

    // Select Status
    const statusDropdown = this.page.locator(this.selectors.statusDropdown);
    await statusDropdown.click();
    await this.page.locator(`.oxd-select-option:has-text("${status}")`).click();
    console.log(`✅ Status: ${status}`);

    // Fill Username
    const usernameField = this.page.locator(this.selectors.usernameInput);
    await usernameField.fill(username);
    console.log(`✅ Username: ${username}`);

    // Fill Password
    const passwordField = this.page.locator(this.selectors.passwordInput);
    await passwordField.fill(password);

    // Confirm Password
    const confirmField = this.page.locator(this.selectors.confirmPasswordInput);
    await confirmField.fill(password);
    console.log('✅ Password filled');

    // Save
    const saveBtn = this.page.locator(this.selectors.saveButton);
    await saveBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ User saved');
  }

  /**
   * Search user by username
   */
  async searchUser(username: string) {
    console.log(`🔍 Searching for user: ${username}`);
    const input = this.page.locator(this.selectors.searchUsernameInput);
    await input.clear();
    await input.fill(username);

    const searchBtn = this.page.locator(this.selectors.searchButton);
    await searchBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Search completed for: ${username}`);
  }

  /**
   * Get user table row count
   */
  async getUserCount(): Promise<number> {
    const rows = this.page.locator(this.selectors.userTableRows);
    const count = await rows.count();
    console.log(`📊 User count: ${count}`);
    return count;
  }

  /**
   * Delete user at specific row
   */
  async deleteUser(rowIndex: number) {
    console.log(`🗑️ Deleting user at row ${rowIndex}...`);
    const row = this.page.locator(this.selectors.userTableRows).nth(rowIndex);
    const deleteBtn = row.locator(this.selectors.deleteIcon);
    await deleteBtn.click();
    await this.page.waitForTimeout(500);

    const confirmBtn = this.page.locator(this.selectors.deleteConfirmButton);
    await confirmBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ User deleted');
  }
}
