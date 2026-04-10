import { Page, expect } from '@playwright/test';

/**
 * PIM (Personal Information Management) Page Object
 * Handles employee CRUD operations and employee list interactions
 * 
 * OrangeHRM Automation Suite
 */
export class PIMPage {
  readonly page: Page;

  readonly selectors = {
    // PIM List
    employeeListHeader: 'h5:has-text("Employee Information")',
    addEmployeeButton: 'button:has-text("Add")',
    employeeTable: '.oxd-table',
    employeeTableRows: '.oxd-table-body .oxd-table-row',
    employeeTableCells: '.oxd-table-cell',

    // Search/Filter
    employeeNameInput: '.oxd-autocomplete-text-input input',
    employeeIdInput: '.oxd-input',
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
    cancelButton: 'button[type="button"]:has-text("Cancel")',

    // Employee Profile tabs
    personalDetailsTab: 'a:has-text("Personal Details")',
    contactDetailsTab: 'a:has-text("Contact Details")',
    emergencyContactsTab: 'a:has-text("Emergency Contacts")',
    dependentsTab: 'a:has-text("Dependents")',
    jobTab: 'a:has-text("Job")',
    salaryTab: 'a:has-text("Salary")',
    taxExemptionsTab: 'a:has-text("Tax Exemptions")',
    qualificationsTab: 'a:has-text("Qualifications")',
    membershipsTab: 'a:has-text("Memberships")',

    // Confirmation dialog
    deleteConfirmButton: 'button:has-text("Yes, Delete")',
    deleteCancelButton: 'button:has-text("No, Cancel")',

    // Table actions
    editIcon: '.bi-pencil-fill',
    deleteIcon: '.bi-trash',
    checkboxAll: '.oxd-table-header .oxd-checkbox-input',
    deleteSelectedButton: 'button:has-text("Delete Selected")',

    // Record count
    recordCount: '.orangehrm-horizontal-padding span',
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to PIM module
   */
  async navigate() {
    console.log('🧭 Navigating to PIM...');
    await this.page.locator('.oxd-main-menu-item:has-text("PIM")').click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to PIM');
  }

  /**
   * Navigate to Add Employee page
   */
  async navigateToAddEmployee() {
    console.log('🧭 Navigating to Add Employee...');
    await this.navigate();
    await this.page.waitForTimeout(500);

    const addTab = this.page.locator('.oxd-topbar-body-nav-tab:has-text("Add Employee")');
    await addTab.waitFor({ state: 'visible', timeout: 10000 });
    await addTab.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to Add Employee page');
  }

  /**
   * Add a new employee
   */
  async addEmployee(firstName: string, lastName: string, middleName?: string, employeeId?: string) {
    console.log(`👤 Adding new employee: ${firstName} ${lastName}`);

    // Fill first name
    const firstNameField = this.page.locator(this.selectors.firstNameInput);
    await firstNameField.waitFor({ state: 'visible', timeout: 10000 });
    await firstNameField.fill(firstName);
    console.log(`✅ First name: ${firstName}`);

    // Fill middle name if provided
    if (middleName) {
      const middleNameField = this.page.locator(this.selectors.middleNameInput);
      await middleNameField.fill(middleName);
      console.log(`✅ Middle name: ${middleName}`);
    }

    // Fill last name
    const lastNameField = this.page.locator(this.selectors.lastNameInput);
    await lastNameField.fill(lastName);
    console.log(`✅ Last name: ${lastName}`);

    // Fill employee ID if provided
    if (employeeId) {
      const idField = this.page.locator(this.selectors.employeeIdField);
      await idField.clear();
      await idField.fill(employeeId);
      console.log(`✅ Employee ID: ${employeeId}`);
    }

    console.log('✅ Employee form filled');
  }

  /**
   * Enable login details for new employee
   */
  async enableLoginDetails(username: string, password: string) {
    console.log('🔐 Enabling login details...');

    // Toggle create login
    const toggle = this.page.locator(this.selectors.createLoginToggle);
    await toggle.click();
    await this.page.waitForTimeout(500);

    // Fill username
    const usernameField = this.page.locator(this.selectors.usernameInput);
    await usernameField.waitFor({ state: 'visible', timeout: 10000 });
    await usernameField.fill(username);

    // Fill password
    const passwordField = this.page.locator(this.selectors.passwordInput);
    await passwordField.fill(password);

    // Confirm password
    const confirmPasswordField = this.page.locator(this.selectors.confirmPasswordInput);
    await confirmPasswordField.fill(password);

    console.log(`✅ Login details: username=${username}`);
  }

  /**
   * Save employee form
   */
  async saveEmployee() {
    console.log('💾 Saving employee...');
    const saveButton = this.page.locator(this.selectors.saveButton);
    await saveButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    console.log('✅ Employee saved');
  }

  /**
   * Search employee by name
   */
  async searchEmployeeByName(name: string) {
    console.log(`🔍 Searching for employee: ${name}`);
    const nameInput = this.page.locator(this.selectors.employeeNameInput).first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.clear();
    await nameInput.fill(name);
    await this.page.waitForTimeout(1000);

    // Select from autocomplete
    const option = this.page.locator('.oxd-autocomplete-option').first();
    if (await option.count() > 0) {
      await option.click();
    }

    // Click search
    const searchBtn = this.page.locator(this.selectors.searchButton);
    await searchBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Search completed for: ${name}`);
  }

  /**
   * Search employee by ID
   */
  async searchEmployeeById(employeeId: string) {
    console.log(`🔍 Searching for employee ID: ${employeeId}`);
    const inputs = this.page.locator('.oxd-grid-item .oxd-input');
    const idInput = inputs.nth(1); // Employee ID is second input
    await idInput.clear();
    await idInput.fill(employeeId);

    const searchBtn = this.page.locator(this.selectors.searchButton);
    await searchBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Search by ID completed: ${employeeId}`);
  }

  /**
   * Get employee table row count
   */
  async getEmployeeCount(): Promise<number> {
    const rows = this.page.locator(this.selectors.employeeTableRows);
    const count = await rows.count();
    console.log(`📊 Employee count: ${count}`);
    return count;
  }

  /**
   * Get record count text
   */
  async getRecordCountText(): Promise<string> {
    const recordCount = this.page.locator(this.selectors.recordCount);
    const text = await recordCount.textContent() || '';
    console.log(`📊 Record count: ${text}`);
    return text;
  }

  /**
   * Delete employee at specific row index
   */
  async deleteEmployee(rowIndex: number) {
    console.log(`🗑️ Deleting employee at row ${rowIndex}...`);
    const row = this.page.locator(this.selectors.employeeTableRows).nth(rowIndex);
    const deleteBtn = row.locator(this.selectors.deleteIcon);
    await deleteBtn.click();
    await this.page.waitForTimeout(500);

    // Confirm deletion
    const confirmBtn = this.page.locator(this.selectors.deleteConfirmButton);
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Employee deleted');
  }

  /**
   * Edit employee at specific row index
   */
  async editEmployee(rowIndex: number) {
    console.log(`✏️ Editing employee at row ${rowIndex}...`);
    const row = this.page.locator(this.selectors.employeeTableRows).nth(rowIndex);
    const editBtn = row.locator(this.selectors.editIcon);
    await editBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Opened employee edit page');
  }

  /**
   * Reset search filters
   */
  async resetFilters() {
    console.log('🔄 Resetting search filters...');
    const resetBtn = this.page.locator(this.selectors.resetButton);
    await resetBtn.click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Filters reset');
  }
}
