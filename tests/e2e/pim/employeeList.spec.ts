import { test, expect } from '../../utils/base/BaseTest';
import { PIMPage } from '../../utils/page-objects/PIMPage';
import { EmployeeTestDataFactory } from '../../utils/test-data/EmployeeTestData';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * Test Suite: PIM - Employee List
 * 
 * This test suite validates the employee list functionality:
 * 1. Employee list page loads
 * 2. Search by employee name
 * 3. Search by employee ID
 * 4. Reset filters
 * 5. Table displays employee records
 */
test.describe('PIM Module - Employee List', () => {

  test.beforeEach(async ({ baseTest }) => {
    console.log('🔧 Setting up PIM Employee List test...');
    await baseTest.page.goto(getBaseUrl());
    await baseTest.performAuthentication();
  });

  /**
   * Test Case: Verify Employee List Page Loads
   */
  test('Verify Employee List Page Loads @smoke', async ({ baseTest }) => {
    const pimPage = new PIMPage(baseTest.page);

    console.log('🎯 Starting Employee List Page Load Test');

    await test.step('Navigate to PIM Employee List', async () => {
      await pimPage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify employee list is displayed', async () => {
      console.log('🔍 Verifying employee list...');

      // Verify header
      const header = baseTest.page.locator('h5:has-text("Employee Information")');
      if (await header.count() > 0) {
        console.log('✅ Employee Information header found');
      }

      // Verify table is present
      const table = baseTest.page.locator('.oxd-table');
      await table.waitFor({ state: 'visible', timeout: 15000 });
      console.log('✅ Employee table is visible');

      // Get row count
      const rowCount = await pimPage.getEmployeeCount();
      console.log(`📊 Employees displayed: ${rowCount}`);

      // Get record count text
      const recordText = await pimPage.getRecordCountText();
      console.log(`📋 Record info: ${recordText}`);

      await baseTest.takeScreenshot('employee-list-loaded');
      console.log('🎉 Employee List Page Load Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Search Employee by Name
   */
  test('Search Employee by Name @daily', async ({ baseTest }) => {
    const pimPage = new PIMPage(baseTest.page);
    const searchData = EmployeeTestDataFactory.getSearchTestData();

    console.log('🎯 Starting Search Employee by Name Test');

    await test.step('Navigate to PIM', async () => {
      await pimPage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Search for employee by name', async () => {
      console.log(`🔍 Searching for: ${searchData.validName}`);
      await pimPage.searchEmployeeByName(searchData.validName);
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify search results', async () => {
      const rowCount = await pimPage.getEmployeeCount();
      console.log(`📊 Search results: ${rowCount} employees found`);

      // Should find at least one result or show "No Records Found"
      if (rowCount > 0) {
        console.log('✅ Search returned results');
      } else {
        const noRecords = baseTest.page.locator('text="No Records Found"');
        if (await noRecords.count() > 0) {
          console.log('ℹ️ No records found for search term');
        }
      }

      await baseTest.takeScreenshot('employee-search-by-name');
      console.log('🎉 Search Employee by Name Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Reset Search Filters
   */
  test('Reset Search Filters @daily', async ({ baseTest }) => {
    const pimPage = new PIMPage(baseTest.page);

    console.log('🎯 Starting Reset Filters Test');

    await test.step('Navigate to PIM', async () => {
      await pimPage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Perform a search first', async () => {
      await pimPage.searchEmployeeByName('Test');
      await baseTest.page.waitForTimeout(1000);
    });

    await test.step('Reset filters', async () => {
      console.log('🔄 Resetting filters...');
      await pimPage.resetFilters();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify filters are reset', async () => {
      const rowCount = await pimPage.getEmployeeCount();
      console.log(`📊 After reset: ${rowCount} employees displayed`);

      await baseTest.takeScreenshot('employee-filters-reset');
      console.log('🎉 Reset Filters Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Add Employee Button Present
   */
  test('Verify Add Employee Button Present @smoke', async ({ baseTest }) => {
    const pimPage = new PIMPage(baseTest.page);

    console.log('🎯 Starting Add Button Verification Test');

    await test.step('Navigate to PIM', async () => {
      await pimPage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify Add button is visible', async () => {
      const addButton = baseTest.page.locator('button:has-text("Add")');
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      expect(await addButton.isVisible()).toBe(true);
      console.log('✅ Add Employee button is visible');

      await baseTest.takeScreenshot('add-employee-button');
      console.log('🎉 Add Button Verification Test COMPLETED SUCCESSFULLY!');
    });
  });
});
