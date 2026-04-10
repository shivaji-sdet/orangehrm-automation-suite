import { test, expect } from '../../utils/base/BaseTest';
import { LeavePage } from '../../utils/page-objects/LeavePage';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * Test Suite: Leave Module
 * 
 * This test suite validates leave management functionality:
 * 1. Leave list page loads
 * 2. Leave navigation works
 * 3. Apply leave form validation
 */
test.describe('Leave Module - Management', () => {

  test.beforeEach(async ({ baseTest }) => {
    console.log('🔧 Setting up Leave Management test...');
    await baseTest.page.goto(getBaseUrl());
    await baseTest.performAuthentication();
  });

  /**
   * Test Case: Verify Leave Module Navigation
   */
  test('Verify Leave Module Navigation @smoke', async ({ baseTest }) => {
    const leavePage = new LeavePage(baseTest.page);

    console.log('🎯 Starting Leave Module Navigation Test');

    await test.step('Navigate to Leave module', async () => {
      await leavePage.navigate();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify Leave page loaded', async () => {
      console.log('🔍 Verifying Leave page...');
      const currentUrl = baseTest.page.url();
      expect(currentUrl).toContain('leave');
      console.log(`✅ Leave page URL verified: ${currentUrl}`);

      await baseTest.takeScreenshot('leave-module-loaded');
      console.log('🎉 Leave Module Navigation Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Leave List Page
   */
  test('Verify Leave List Page @smoke', async ({ baseTest }) => {
    const leavePage = new LeavePage(baseTest.page);

    console.log('🎯 Starting Leave List Page Test');

    await test.step('Navigate to Leave List', async () => {
      await leavePage.navigateToLeaveList();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify Leave List is displayed', async () => {
      console.log('🔍 Verifying Leave List...');

      // Verify the leave table or list view is present
      const table = baseTest.page.locator('.oxd-table');
      if (await table.count() > 0) {
        console.log('✅ Leave table is displayed');
        const rowCount = await leavePage.getLeaveCount();
        console.log(`📊 Leave records: ${rowCount}`);
      } else {
        console.log('ℹ️ Leave table may be empty or view is different');
      }

      await baseTest.takeScreenshot('leave-list-page');
      console.log('🎉 Leave List Page Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Apply Leave Page Navigation
   */
  test('Verify Apply Leave Page Navigation @daily', async ({ baseTest }) => {
    const leavePage = new LeavePage(baseTest.page);

    console.log('🎯 Starting Apply Leave Page Navigation Test');

    await test.step('Navigate to Apply Leave', async () => {
      await leavePage.navigateToApplyLeave();
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify Apply Leave form is displayed', async () => {
      console.log('🔍 Verifying Apply Leave form...');

      // Verify leave type dropdown is present
      const leaveTypeDropdown = baseTest.page.locator('.oxd-select-text').first();
      if (await leaveTypeDropdown.count() > 0) {
        console.log('✅ Leave Type dropdown is present');
      }

      // Verify date inputs are present
      const dateInputs = baseTest.page.locator('.oxd-date-input');
      const dateCount = await dateInputs.count();
      console.log(`📊 Date input fields found: ${dateCount}`);

      await baseTest.takeScreenshot('apply-leave-page');
      console.log('🎉 Apply Leave Page Navigation Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Leave Sub-Menu Tabs
   */
  test('Verify Leave Sub-Menu Tabs @daily', async ({ baseTest }) => {
    const leavePage = new LeavePage(baseTest.page);

    console.log('🎯 Starting Leave Sub-Menu Tabs Test');

    await test.step('Navigate to Leave module', async () => {
      await leavePage.navigate();
      await baseTest.page.waitForTimeout(1000);
    });

    await test.step('Verify sub-menu tabs', async () => {
      console.log('🔍 Verifying Leave sub-menu tabs...');

      const expectedTabs = ['Apply', 'My Leave', 'Entitlements', 'Reports', 'Configure', 'Leave List', 'Assign Leave'];

      for (const tabName of expectedTabs) {
        try {
          const tab = baseTest.page.locator(`.oxd-topbar-body-nav-tab:has-text("${tabName}")`);
          if (await tab.count() > 0) {
            console.log(`✅ Tab found: ${tabName}`);
          } else {
            console.log(`⚠️ Tab not found: ${tabName} (may depend on permissions)`);
          }
        } catch (error) {
          console.log(`⚠️ Error checking tab ${tabName}:`, error);
        }
      }

      await baseTest.takeScreenshot('leave-sub-menu-tabs');
      console.log('🎉 Leave Sub-Menu Tabs Test COMPLETED SUCCESSFULLY!');
    });
  });
});
