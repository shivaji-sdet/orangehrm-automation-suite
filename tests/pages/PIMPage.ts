import { Page, Locator } from '@playwright/test';

export class PIMPage {
  readonly tableRows: Locator;
  readonly addButton: Locator;
  readonly validationErrors: Locator;

  constructor(private readonly page: Page) {
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.addButton = page.locator('button:has-text("Add")');
    this.validationErrors = page.locator('.oxd-input-field-error-message');
  }

  async navigateToEmployeeList() {
    await this.page.goto('/web/index.php/pim/viewPimModule');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToAddEmployee() {
    await this.page.goto('/web/index.php/pim/addEmployee');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillEmployeeDetails(firstName: string, lastName: string, middleName?: string, employeeId?: string) {
    await this.page.fill('input[name="firstName"]', firstName);
    if (middleName) await this.page.fill('input[name="middleName"]', middleName);
    await this.page.fill('input[name="lastName"]', lastName);
    if (employeeId) {
      const idField = this.page.locator('.oxd-grid-item:has(.oxd-label:has-text("Employee Id")) input');
      await idField.clear();
      await idField.fill(employeeId);
    }
  }

  async enableLoginCredentials(username: string, password: string) {
    await this.page.locator('.oxd-switch-input').click();
    await this.page.locator('.oxd-grid-item:has(.oxd-label:has-text("Username")) input').waitFor({ state: 'visible' });
    await this.page.fill('.oxd-grid-item:has(.oxd-label:has-text("Username")) input', username);
    await this.page.fill('.oxd-grid-item:has(.oxd-label:has-text("Password")) input', password);
    await this.page.fill('.oxd-grid-item:has(.oxd-label:has-text("Confirm Password")) input', password);
  }

  async saveEmployee() {
    await this.page.locator('button[type="submit"]:has-text("Save")').click();
  }

  async searchByName(name: string) {
    const input = this.page.locator('.oxd-autocomplete-text-input input').first();
    await input.clear();
    await input.fill(name);
    const option = this.page.locator('.oxd-autocomplete-option').first();
    if (await option.isVisible()) await option.click();
    await this.page.locator('button[type="submit"]:has-text("Search")').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async resetSearch() {
    await this.page.locator('button[type="reset"]:has-text("Reset")').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getRowCount() {
    return this.tableRows.count();
  }
}
