import { Page, expect } from '@playwright/test';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

export class OrangeHRMPage {
  readonly page: Page;

  readonly selectors = {
    // Login
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
    loginError: '.oxd-alert-content-text',

    // Layout
    sideMenu: '.oxd-sidepanel',
    topBar: '.oxd-topbar',
    mainContent: '.oxd-layout-context',
    breadcrumb: '.oxd-topbar-header-breadcrumb',

    // Navigation
    menuItem: '.oxd-main-menu-item',
    topBarNavTab: '.oxd-topbar-body-nav-tab',
    dropdownMenu: '.oxd-dropdown-menu',

    // Notifications
    toastMessage: '.oxd-toast',
    toastSuccess: '.oxd-toast--success',
    toastError: '.oxd-toast--error',
    spinner: '.oxd-loading-spinner',
    dialog: '.oxd-dialog-sheet',

    // Table
    tableRow: '.oxd-table-body .oxd-table-row',
    tableCell: '.oxd-table-cell',

    // Form elements
    inputField: '.oxd-input',
    selectDropdown: '.oxd-select-text',
    autocompleteInput: '.oxd-autocomplete-text-input input',
    datePicker: '.oxd-date-input',
    checkbox: '.oxd-checkbox-input',
    textArea: '.oxd-textarea',

    // Buttons
    submitButton: 'button[type="submit"]',
    cancelButton: 'button[type="button"]:has-text("Cancel")',
    addButton: 'button:has-text("Add")',
    saveButton: 'button[type="submit"]:has-text("Save")',
    searchButton: 'button[type="submit"]:has-text("Search")',
    resetButton: 'button[type="reset"]:has-text("Reset")',

    // User menu
    userDropdown: '.oxd-userdropdown',
    logoutLink: 'a:has-text("Logout")',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo() {
    await this.page.goto(getBaseUrl());
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToPath(path: string) {
    await this.page.goto(`${getBaseUrl()}${path}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToModule(moduleName: string) {
    await this.page.locator(`${this.selectors.menuItem}:has-text("${moduleName}")`).click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSubMenu(topMenu: string, subMenu?: string) {
    await this.page.locator(`${this.selectors.topBarNavTab}:has-text("${topMenu}")`).click();
    if (subMenu) {
      await this.page.locator(`${this.selectors.dropdownMenu} a:has-text("${subMenu}")`).click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getPageHeader(): Promise<string> {
    return await this.page.locator(`${this.selectors.breadcrumb} h6`).textContent() || '';
  }

  async verifyPageHeader(expectedText: string) {
    expect(await this.getPageHeader()).toContain(expectedText);
  }

  async waitForToast(expectedText?: string): Promise<string> {
    const toast = this.page.locator(this.selectors.toastMessage);
    await toast.waitFor({ state: 'visible', timeout: 10000 });
    const text = await toast.textContent() || '';
    if (expectedText) expect(text).toContain(expectedText);
    return text;
  }

  async waitForSpinner() {
    const spinner = this.page.locator(this.selectors.spinner);
    if (await spinner.count() > 0) {
      await spinner.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  async getTableRowCount(): Promise<number> {
    return await this.page.locator(this.selectors.tableRow).count();
  }

  async getTableCellText(rowIndex: number, colIndex: number): Promise<string> {
    return await this.page.locator(this.selectors.tableRow)
      .nth(rowIndex).locator(this.selectors.tableCell).nth(colIndex).textContent() || '';
  }

  async deleteTableRow(rowIndex: number) {
    await this.page.locator(this.selectors.tableRow).nth(rowIndex).locator('button .bi-trash').click();
  }

  async editTableRow(rowIndex: number) {
    await this.page.locator(this.selectors.tableRow).nth(rowIndex).locator('button .bi-pencil-fill').click();
  }

  async confirmDialog() {
    await this.page.locator(`${this.selectors.dialog} button:has-text("Yes, Delete")`).click();
  }

  async cancelDialog() {
    await this.page.locator(`${this.selectors.dialog} button:has-text("No, Cancel")`).click();
  }

  async logout() {
    await this.page.locator(this.selectors.userDropdown).click();
    await this.page.locator(this.selectors.logoutLink).click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn(): Promise<boolean> {
    const menu = this.page.locator(this.selectors.sideMenu);
    return await menu.count() > 0 && await menu.isVisible();
  }
}
