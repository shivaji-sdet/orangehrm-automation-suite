import { Page } from '@playwright/test';

export class PIMPage {
  readonly page: Page;

  readonly selectors = {
    employeeTableRows: '.oxd-table-body .oxd-table-row',
    employeeNameInput: '.oxd-autocomplete-text-input input',
    searchButton: 'button[type="submit"]:has-text("Search")',
    resetButton: 'button[type="reset"]:has-text("Reset")',

    // Add Employee Form
    firstNameInput: 'input[name="firstName"]',
    middleNameInput: 'input[name="middleName"]',
    lastNameInput: 'input[name="lastName"]',
    employeeIdField: '.oxd-grid-item:has(.oxd-label:has-text("Employee Id")) input.oxd-input',
    createLoginToggle: '.oxd-switch-input',
    usernameInput: '.oxd-grid-item:has(.oxd-label:has-text("Username")) input.oxd-input',
    passwordInput: '.oxd-grid-item:has(.oxd-label:has-text("Password")) input.oxd-input',
    confirmPasswordInput: '.oxd-grid-item:has(.oxd-label:has-text("Confirm Password")) input.oxd-input',
    saveButton: 'button[type="submit"]:has-text("Save")',

    // Table actions
    editIcon: '.bi-pencil-fill',
    deleteIcon: '.bi-trash',
    deleteConfirmButton: 'button:has-text("Yes, Delete")',
    recordCount: '.orangehrm-horizontal-padding span',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.locator('.oxd-main-menu-item:has-text("PIM")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAddEmployee() {
    await this.navigate();
    await this.page.locator('.oxd-topbar-body-nav-tab:has-text("Add Employee")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async addEmployee(firstName: string, lastName: string, middleName?: string, employeeId?: string) {
    await this.page.locator(this.selectors.firstNameInput).fill(firstName);
    if (middleName) await this.page.locator(this.selectors.middleNameInput).fill(middleName);
    await this.page.locator(this.selectors.lastNameInput).fill(lastName);
    if (employeeId) {
      await this.page.locator(this.selectors.employeeIdField).clear();
      await this.page.locator(this.selectors.employeeIdField).fill(employeeId);
    }
  }

  async enableLoginDetails(username: string, password: string) {
    await this.page.locator(this.selectors.createLoginToggle).click();
    await this.page.locator(this.selectors.usernameInput).waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator(this.selectors.usernameInput).fill(username);
    await this.page.locator(this.selectors.passwordInput).fill(password);
    await this.page.locator(this.selectors.confirmPasswordInput).fill(password);
  }

  async saveEmployee() {
    await this.page.locator(this.selectors.saveButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeByName(name: string) {
    const nameInput = this.page.locator(this.selectors.employeeNameInput).first();
    await nameInput.clear();
    await nameInput.fill(name);
    await this.page.waitForTimeout(1000);
    const option = this.page.locator('.oxd-autocomplete-option').first();
    if (await option.count() > 0) await option.click();
    await this.page.locator(this.selectors.searchButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeById(employeeId: string) {
    const idInput = this.page.locator('.oxd-grid-item .oxd-input').nth(1);
    await idInput.clear();
    await idInput.fill(employeeId);
    await this.page.locator(this.selectors.searchButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getEmployeeCount(): Promise<number> {
    return await this.page.locator(this.selectors.employeeTableRows).count();
  }

  async getRecordCountText(): Promise<string> {
    return await this.page.locator(this.selectors.recordCount).textContent() || '';
  }

  async deleteEmployee(rowIndex: number) {
    await this.page.locator(this.selectors.employeeTableRows).nth(rowIndex).locator(this.selectors.deleteIcon).click();
    await this.page.locator(this.selectors.deleteConfirmButton).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator(this.selectors.deleteConfirmButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async editEmployee(rowIndex: number) {
    await this.page.locator(this.selectors.employeeTableRows).nth(rowIndex).locator(this.selectors.editIcon).click();
    await this.page.waitForLoadState('networkidle');
  }

  async resetFilters() {
    await this.page.locator(this.selectors.resetButton).click();
    await this.page.waitForLoadState('networkidle');
  }
}
