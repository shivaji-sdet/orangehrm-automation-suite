import { Page, expect } from '@playwright/test';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * OrangeHRM Main Page Object
 * Mirrors LumberFiAdminPage pattern - provides common page interactions
 * 
 * OrangeHRM Automation Suite
 */
export class OrangeHRMPage {
  readonly page: Page;

  // Common selectors
  readonly selectors = {
    // Login page
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
    loginError: '.oxd-alert-content-text',

    // Main layout
    sideMenu: '.oxd-sidepanel',
    topBar: '.oxd-topbar',
    mainContent: '.oxd-layout-context',
    breadcrumb: '.oxd-topbar-header-breadcrumb',

    // Navigation
    menuItem: '.oxd-main-menu-item',
    topBarNavTab: '.oxd-topbar-body-nav-tab',
    dropdownMenu: '.oxd-dropdown-menu',

    // Common components
    toastMessage: '.oxd-toast',
    toastSuccess: '.oxd-toast--success',
    toastError: '.oxd-toast--error',
    toastWarning: '.oxd-toast--warn',
    spinner: '.oxd-loading-spinner',
    dialog: '.oxd-dialog-sheet',
    dialogTitle: '.oxd-dialog-sheet .oxd-text--card-title',

    // Table
    table: '.oxd-table',
    tableRow: '.oxd-table-body .oxd-table-row',
    tableHeader: '.oxd-table-header',
    tableCell: '.oxd-table-cell',

    // Form elements
    inputField: '.oxd-input',
    selectDropdown: '.oxd-select-text',
    autocompleteInput: '.oxd-autocomplete-text-input input',
    datePicker: '.oxd-date-input',
    checkbox: '.oxd-checkbox-input',
    radioButton: '.oxd-radio-input',
    toggleSwitch: '.oxd-switch-input',
    textArea: '.oxd-textarea',

    // Buttons
    submitButton: 'button[type="submit"]',
    cancelButton: 'button[type="button"]:has-text("Cancel")',
    addButton: 'button:has-text("Add")',
    deleteButton: 'button:has-text("Delete")',
    saveButton: 'button[type="submit"]:has-text("Save")',
    searchButton: 'button[type="submit"]:has-text("Search")',
    resetButton: 'button[type="reset"]:has-text("Reset")',

    // Pagination
    pagination: '.oxd-table-pager',
    paginationNext: '.oxd-pagination-page-item--next',
    paginationPrev: '.oxd-pagination-page-item--previous',

    // User dropdown
    userDropdown: '.oxd-userdropdown',
    userDropdownMenu: '.oxd-dropdown-menu',
    logoutLink: 'a:has-text("Logout")',
    aboutLink: 'a:has-text("About")',
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to OrangeHRM base URL
   */
  async navigateTo() {
    console.log('🧭 Navigating to OrangeHRM...');
    await this.page.goto(getBaseUrl());
    await this.page.waitForLoadState('domcontentloaded');
    console.log('✅ Navigated to OrangeHRM');
  }

  /**
   * Navigate to specific path
   */
  async navigateToPath(path: string) {
    console.log(`🧭 Navigating to: ${path}`);
    await this.page.goto(`${getBaseUrl()}${path}`);
    await this.page.waitForLoadState('domcontentloaded');
    console.log(`✅ Navigated to ${path}`);
  }

  /**
   * Navigate to a module via side menu
   */
  async navigateToModule(moduleName: string) {
    console.log(`🧭 Navigating to module: ${moduleName}`);
    const menuItem = this.page.locator(`${this.selectors.menuItem}:has-text("${moduleName}")`);
    await menuItem.waitFor({ state: 'visible', timeout: 15000 });
    await menuItem.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to ${moduleName}`);
  }

  /**
   * Navigate to sub-menu within a top bar
   */
  async navigateToSubMenu(topMenu: string, subMenu?: string) {
    const topTab = this.page.locator(`${this.selectors.topBarNavTab}:has-text("${topMenu}")`);
    await topTab.waitFor({ state: 'visible', timeout: 10000 });
    await topTab.click();

    if (subMenu) {
      await this.page.waitForTimeout(300);
      const subMenuItem = this.page.locator(`${this.selectors.dropdownMenu} a:has-text("${subMenu}")`);
      await subMenuItem.waitFor({ state: 'visible', timeout: 10000 });
      await subMenuItem.click();
    }

    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to ${topMenu}${subMenu ? ` > ${subMenu}` : ''}`);
  }

  /**
   * Get page header text
   */
  async getPageHeader(): Promise<string> {
    const header = this.page.locator(`${this.selectors.breadcrumb} h6`);
    await header.waitFor({ state: 'visible', timeout: 10000 });
    return await header.textContent() || '';
  }

  /**
   * Verify page header
   */
  async verifyPageHeader(expectedText: string) {
    const headerText = await this.getPageHeader();
    expect(headerText).toContain(expectedText);
    console.log(`✅ Page header verified: ${expectedText}`);
  }

  /**
   * Wait for toast notification and verify
   */
  async waitForToast(expectedText?: string): Promise<string> {
    const toast = this.page.locator(this.selectors.toastMessage);
    await toast.waitFor({ state: 'visible', timeout: 10000 });
    const toastText = await toast.textContent() || '';
    console.log(`🔔 Toast: ${toastText}`);

    if (expectedText) {
      expect(toastText).toContain(expectedText);
      console.log(`✅ Toast verified: ${expectedText}`);
    }

    return toastText;
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForSpinner() {
    try {
      const spinner = this.page.locator(this.selectors.spinner);
      if (await spinner.count() > 0) {
        await spinner.waitFor({ state: 'hidden', timeout: 30000 });
        console.log('✅ Loading spinner disappeared');
      }
    } catch (error) {
      // Spinner may not appear, continue
    }
  }

  /**
   * Get table row count
   */
  async getTableRowCount(): Promise<number> {
    const rows = this.page.locator(this.selectors.tableRow);
    const count = await rows.count();
    console.log(`📊 Table rows: ${count}`);
    return count;
  }

  /**
   * Get table cell text by row and column index
   */
  async getTableCellText(rowIndex: number, colIndex: number): Promise<string> {
    const cell = this.page.locator(this.selectors.tableRow).nth(rowIndex).locator(this.selectors.tableCell).nth(colIndex);
    return await cell.textContent() || '';
  }

  /**
   * Click delete button on a specific table row
   */
  async deleteTableRow(rowIndex: number) {
    const row = this.page.locator(this.selectors.tableRow).nth(rowIndex);
    const deleteButton = row.locator('button .bi-trash');
    await deleteButton.click();
    console.log(`🗑️ Clicked delete on row ${rowIndex}`);
  }

  /**
   * Click edit button on a specific table row
   */
  async editTableRow(rowIndex: number) {
    const row = this.page.locator(this.selectors.tableRow).nth(rowIndex);
    const editButton = row.locator('button .bi-pencil-fill');
    await editButton.click();
    console.log(`✏️ Clicked edit on row ${rowIndex}`);
  }

  /**
   * Confirm dialog action (Yes, Delete)
   */
  async confirmDialog() {
    const confirmButton = this.page.locator(`${this.selectors.dialog} button:has-text("Yes, Delete")`);
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();
    console.log('✅ Dialog confirmed');
  }

  /**
   * Cancel dialog
   */
  async cancelDialog() {
    const cancelButton = this.page.locator(`${this.selectors.dialog} button:has-text("No, Cancel")`);
    await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
    await cancelButton.click();
    console.log('✅ Dialog cancelled');
  }

  /**
   * Logout from OrangeHRM
   */
  async logout() {
    console.log('🚪 Logging out...');
    const userDropdown = this.page.locator(this.selectors.userDropdown);
    await userDropdown.click();
    await this.page.waitForTimeout(300);

    const logoutLink = this.page.locator(this.selectors.logoutLink);
    await logoutLink.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Logged out successfully');
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const menu = this.page.locator(this.selectors.sideMenu);
      return await menu.count() > 0 && await menu.isVisible();
    } catch {
      return false;
    }
  }
}
