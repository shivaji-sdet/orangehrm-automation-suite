import { Page, expect } from '@playwright/test';

/**
 * Test Helpers - Common utility functions for test automation
 * Provides reusable helper methods across all test files
 * 
 * OrangeHRM Automation Suite
 */
export class TestHelpers {

  /**
   * Wait for page to be fully loaded with network idle
   */
  static async waitForPageLoad(page: Page, timeout?: number) {
    await page.waitForLoadState('networkidle', { timeout: timeout || 30000 });
    console.log('✅ Page fully loaded');
  }

  /**
   * Wait for element and return it
   */
  static async waitForElement(page: Page, selector: string, timeout?: number) {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: timeout || 15000 });
    return element;
  }

  /**
   * Safe click with retry logic
   */
  static async safeClick(page: Page, selector: string, elementName: string, retries: number = 2) {
    for (let i = 0; i < retries; i++) {
      try {
        const element = page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: 15000 });
        await element.click();
        console.log(`✅ Clicked ${elementName}`);
        return;
      } catch (error) {
        console.log(`⚠️ Attempt ${i + 1} failed to click ${elementName}:`, error);
        if (i === retries - 1) throw error;
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Safe fill with validation
   */
  static async safeFill(page: Page, selector: string, value: string, fieldName: string) {
    try {
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 15000 });
      await element.clear();
      await element.fill(value);
      console.log(`✅ Filled ${fieldName}: ${value}`);
    } catch (error) {
      console.log(`❌ Failed to fill ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Select dropdown option in OrangeHRM
   * OrangeHRM uses custom dropdowns, not native <select> elements
   */
  static async selectDropdownOption(page: Page, dropdownSelector: string, optionText: string, fieldName: string) {
    try {
      console.log(`🔽 Selecting "${optionText}" from "${fieldName}" dropdown...`);

      // Click the dropdown to open it
      const dropdown = page.locator(dropdownSelector);
      await dropdown.waitFor({ state: 'visible', timeout: 15000 });
      await dropdown.click();
      await page.waitForTimeout(500);

      // Select the option
      const option = page.locator(`.oxd-select-option:has-text("${optionText}")`);
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();

      console.log(`✅ Selected "${optionText}" from "${fieldName}"`);
    } catch (error) {
      console.log(`❌ Failed to select dropdown option for ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Select autocomplete option in OrangeHRM
   */
  static async selectAutocomplete(page: Page, inputSelector: string, searchText: string, fieldName: string) {
    try {
      console.log(`🔍 Searching for "${searchText}" in "${fieldName}" autocomplete...`);

      const input = page.locator(inputSelector);
      await input.waitFor({ state: 'visible', timeout: 15000 });
      await input.clear();
      await input.fill(searchText);
      await page.waitForTimeout(1000);

      // Select the first matching option
      const option = page.locator('.oxd-autocomplete-option').first();
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();

      console.log(`✅ Selected "${searchText}" from "${fieldName}" autocomplete`);
    } catch (error) {
      console.log(`❌ Failed to select autocomplete for ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Verify toast message appears
   */
  static async verifyToastMessage(page: Page, expectedText: string) {
    try {
      const toast = page.locator('.oxd-toast');
      await toast.waitFor({ state: 'visible', timeout: 10000 });
      const toastText = await toast.textContent();
      console.log(`🔔 Toast message: ${toastText}`);
      expect(toastText).toContain(expectedText);
      console.log(`✅ Toast message verified: "${expectedText}"`);
    } catch (error) {
      console.log(`❌ Toast message verification failed:`, error);
      throw error;
    }
  }

  /**
   * Navigate to OrangeHRM module via side menu
   */
  static async navigateToModule(page: Page, moduleName: string) {
    try {
      console.log(`🧭 Navigating to module: ${moduleName}`);
      const menuItem = page.locator(`.oxd-main-menu-item:has-text("${moduleName}")`);
      await menuItem.waitFor({ state: 'visible', timeout: 15000 });
      await menuItem.click();
      await page.waitForLoadState('networkidle');
      console.log(`✅ Navigated to ${moduleName} module`);
    } catch (error) {
      console.log(`❌ Failed to navigate to ${moduleName}:`, error);
      throw error;
    }
  }

  /**
   * Get table row count from OrangeHRM data grid
   */
  static async getTableRowCount(page: Page): Promise<number> {
    const rows = page.locator('.oxd-table-body .oxd-table-row');
    const count = await rows.count();
    console.log(`📊 Table row count: ${count}`);
    return count;
  }

  /**
   * Search in OrangeHRM table
   */
  static async searchInTable(page: Page, searchText: string) {
    try {
      console.log(`🔍 Searching for: ${searchText}`);
      const searchInput = page.locator('.oxd-table-filter input[placeholder="Type for hints..."]').first();
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      await searchInput.clear();
      await searchInput.fill(searchText);
      await page.waitForTimeout(1000);
      console.log(`✅ Search completed for: ${searchText}`);
    } catch (error) {
      console.log(`❌ Search failed:`, error);
      throw error;
    }
  }

  /**
   * Generate a unique test ID
   */
  static generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Generate a random string
   */
  static generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  /**
   * Format date for OrangeHRM input fields (yyyy-dd-MM)
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${day}-${month}`;
  }

  /**
   * Take a named screenshot
   */
  static async takeScreenshot(page: Page, name: string, fullPage: boolean = true) {
    await page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage,
    });
    console.log(`📸 Screenshot saved: ${name}.png`);
  }
}
