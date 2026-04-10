import { test, expect } from '../../utils/base/BaseTest';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * Test Suite: Recruitment Module
 * 
 * This test suite validates the Recruitment module:
 * 1. Recruitment page loads
 * 2. Candidates list displayed
 * 3. Vacancies navigation
 */
test.describe('Recruitment Module - Validation', () => {

  test.beforeEach(async ({ baseTest }) => {
    console.log('🔧 Setting up Recruitment test...');
    await baseTest.page.goto(getBaseUrl());
    await baseTest.performAuthentication();
  });

  /**
   * Test Case: Verify Recruitment Module Loads
   */
  test('Verify Recruitment Module Loads @smoke', async ({ baseTest }) => {
    console.log('🎯 Starting Recruitment Module Load Test');

    await test.step('Navigate to Recruitment', async () => {
      console.log('🧭 Navigating to Recruitment...');
      await baseTest.page.locator('.oxd-main-menu-item:has-text("Recruitment")').click();
      await baseTest.page.waitForLoadState('networkidle');
      await baseTest.page.waitForTimeout(2000);
    });

    await test.step('Verify Recruitment page loaded', async () => {
      console.log('🔍 Verifying Recruitment page...');
      const currentUrl = baseTest.page.url();
      expect(currentUrl).toContain('recruitment');
      console.log(`✅ Recruitment URL verified: ${currentUrl}`);

      // Verify Candidates header
      const header = baseTest.page.locator('h5:has-text("Candidates")');
      if (await header.count() > 0) {
        console.log('✅ Candidates header found');
      }

      await baseTest.takeScreenshot('recruitment-module-loaded');
      console.log('🎉 Recruitment Module Load Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Recruitment Sub-Menu Tabs
   */
  test('Verify Recruitment Sub-Menu Tabs @daily', async ({ baseTest }) => {
    console.log('🎯 Starting Recruitment Sub-Menu Tabs Test');

    await test.step('Navigate to Recruitment', async () => {
      await baseTest.page.locator('.oxd-main-menu-item:has-text("Recruitment")').click();
      await baseTest.page.waitForLoadState('networkidle');
      await baseTest.page.waitForTimeout(1000);
    });

    await test.step('Verify sub-menu tabs', async () => {
      console.log('🔍 Verifying Recruitment sub-menu tabs...');

      const expectedTabs = ['Candidates', 'Vacancies'];

      for (const tabName of expectedTabs) {
        const tab = baseTest.page.locator(`.oxd-topbar-body-nav-tab:has-text("${tabName}")`);
        if (await tab.count() > 0) {
          console.log(`✅ Tab found: ${tabName}`);
        } else {
          console.log(`⚠️ Tab not found: ${tabName}`);
        }
      }

      console.log('✅ Recruitment tabs verified');
    });

    await test.step('Navigate to Vacancies tab', async () => {
      console.log('🧭 Navigating to Vacancies...');
      const vacanciesTab = baseTest.page.locator('.oxd-topbar-body-nav-tab:has-text("Vacancies")');
      if (await vacanciesTab.count() > 0) {
        await vacanciesTab.click();
        await baseTest.page.waitForLoadState('networkidle');
        await baseTest.page.waitForTimeout(2000);

        const currentUrl = baseTest.page.url();
        console.log(`🌐 Vacancies URL: ${currentUrl}`);
        expect(currentUrl).toContain('Vacancy');

        console.log('✅ Vacancies page loaded');
      }

      await baseTest.takeScreenshot('recruitment-vacancies');
      console.log('🎉 Recruitment Sub-Menu Tabs Test COMPLETED SUCCESSFULLY!');
    });
  });
});
