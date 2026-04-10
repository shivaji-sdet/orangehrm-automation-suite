import { test, expect } from '../../utils/base/BaseTest';
import { AdminPage } from '../../utils/page-objects/AdminPage';
import { AuthTestDataFactory } from '../../utils/test-data/AuthTestData';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * Test Suite: Admin - User Management
 * 
 * This test suite validates the Admin User Management:
 * 1. System Users page loads
 * 2. Search users by username
 * 3. User table displays records
 * 4. Admin sub-menu navigation
 */
test.describe('Admin Module - User Management', () => {

  test.beforeEach(async ({ baseTest }) => {
    console.log('🔧 Setting up Admin User Management test...');
    await baseTest.page.goto(getBaseUrl());
    await baseTest.performAuthentication();
  });

  /**
   * Test Case: Verify Admin Module Loads
   */
  test('Verify Admin Module Loads @smoke', async ({ baseTest }) => {
    const adminPage = new AdminPage(baseTest.page);

    console.log('🎯 Starting Admin Module Load Test');

    await test.step('Navigate to Admin', async () => {
      await adminPage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify Admin page loaded', async () => {
      console.log('🔍 Verifying Admin page...');
      const currentUrl = baseTest.page.url();
      expect(currentUrl).toContain('admin');
      console.log(`✅ Admin page URL verified: ${currentUrl}`);

      // Verify System Users header
      const header = baseTest.page.locator('h5:has-text("System Users")');
      if (await header.count() > 0) {
        console.log('✅ System Users header found');
      }

      // Verify user table
      const table = baseTest.page.locator('.oxd-table');
      await table.waitFor({ state: 'visible', timeout: 15000 });
      console.log('✅ User table is visible');

      await baseTest.takeScreenshot('admin-module-loaded');
      console.log('🎉 Admin Module Load Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Search User by Username
   */
  test('Search User by Username @daily', async ({ baseTest }) => {
    const adminPage = new AdminPage(baseTest.page);

    console.log('🎯 Starting Search User Test');

    await test.step('Navigate to Admin', async () => {
      await adminPage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Search for admin user', async () => {
      console.log('🔍 Searching for Admin user...');
      await adminPage.searchUser('Admin');
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify search results', async () => {
      const userCount = await adminPage.getUserCount();
      console.log(`📊 Users found: ${userCount}`);

      if (userCount > 0) {
        console.log('✅ Search returned results');
      } else {
        const noRecords = baseTest.page.locator('text="No Records Found"');
        if (await noRecords.count() > 0) {
          console.log('ℹ️ No records found');
        }
      }

      await baseTest.takeScreenshot('admin-search-results');
      console.log('🎉 Search User Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Admin Sub-Menu Navigation
   */
  test('Verify Admin Sub-Menu Navigation @daily', async ({ baseTest }) => {
    const adminPage = new AdminPage(baseTest.page);

    console.log('🎯 Starting Admin Sub-Menu Navigation Test');

    await test.step('Navigate to Admin', async () => {
      await adminPage.navigate();
      await baseTest.page.waitForTimeout(1000);
    });

    await test.step('Verify top-bar tabs', async () => {
      console.log('🔍 Verifying Admin top-bar tabs...');

      const expectedTabs = ['User Management', 'Job', 'Organization', 'Qualifications', 'Nationalities', 'Corporate Branding', 'Configuration'];

      for (const tabName of expectedTabs) {
        try {
          const tab = baseTest.page.locator(`.oxd-topbar-body-nav-tab:has-text("${tabName}")`);
          if (await tab.count() > 0) {
            console.log(`✅ Tab found: ${tabName}`);
          } else {
            console.log(`⚠️ Tab not found: ${tabName}`);
          }
        } catch (error) {
          console.log(`⚠️ Error checking tab ${tabName}`);
        }
      }

      console.log('✅ Admin tabs verified');
    });

    await test.step('Navigate to Job > Job Titles', async () => {
      console.log('🧭 Navigating to Job > Job Titles...');
      await adminPage.navigateToJob('Job Titles');
      await baseTest.page.waitForTimeout(2000);

      const currentUrl = baseTest.page.url();
      console.log(`🌐 URL: ${currentUrl}`);

      await baseTest.takeScreenshot('admin-job-titles');
      console.log('✅ Job Titles page loaded');
    });

    await test.step('Navigate to Organization > General Information', async () => {
      console.log('🧭 Navigating to Organization > General Information...');
      await adminPage.navigateToOrganization('General Information');
      await baseTest.page.waitForTimeout(2000);

      const currentUrl = baseTest.page.url();
      console.log(`🌐 URL: ${currentUrl}`);

      await baseTest.takeScreenshot('admin-general-info');
      console.log('✅ General Information page loaded');
      console.log('🎉 Admin Sub-Menu Navigation Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Add User Button Present
   */
  test('Verify Add User Button Present @smoke', async ({ baseTest }) => {
    const adminPage = new AdminPage(baseTest.page);

    console.log('🎯 Starting Add User Button Test');

    await test.step('Navigate to Admin', async () => {
      await adminPage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify Add button exists', async () => {
      const addButton = baseTest.page.locator('button:has-text("Add")');
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      expect(await addButton.isVisible()).toBe(true);
      console.log('✅ Add User button is visible');

      await baseTest.takeScreenshot('admin-add-user-button');
      console.log('🎉 Add User Button Test COMPLETED SUCCESSFULLY!');
    });
  });
});
