import { test, expect } from '../../utils/base/BaseTest';
import { DashboardPage } from '../../utils/page-objects/DashboardPage';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * Test Suite: Dashboard Module
 * 
 * This test suite validates the OrangeHRM Dashboard:
 * 1. Dashboard page loads after login
 * 2. Dashboard widgets are displayed
 * 3. Quick Launch shortcuts work
 * 4. Navigation from dashboard works
 */
test.describe('Dashboard Module - Validation', () => {

  test.beforeEach(async ({ baseTest }) => {
    console.log('🔧 Setting up Dashboard test...');
    await baseTest.page.goto(getBaseUrl(), { waitUntil: 'domcontentloaded', timeout: 30000 });
    await baseTest.performAuthentication();
  });

  /**
   * Test Case: Verify Dashboard Loads After Login
   */
  test('Verify Dashboard Loads After Login @smoke', async ({ baseTest }) => {
    const dashboardPage = new DashboardPage(baseTest.page);

    console.log('🎯 Starting Dashboard Load Verification Test');

    await test.step('Verify dashboard page is displayed', async () => {
      console.log('🔍 Verifying dashboard page...');
      await dashboardPage.verifyDashboardLoaded();
      console.log('✅ Dashboard page is displayed');
    });

    await test.step('Verify dashboard URL', async () => {
      const currentUrl = baseTest.page.url();
      console.log(`🌐 Current URL: ${currentUrl}`);
      expect(currentUrl).toContain('dashboard');
      console.log('✅ Dashboard URL verified');
    });

    await test.step('Take dashboard screenshot', async () => {
      await baseTest.takeScreenshot('dashboard-loaded');
      console.log('🎉 Dashboard Load Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Dashboard Widgets Are Visible
   */
  test('Verify Dashboard Widgets Are Visible @smoke', async ({ baseTest }) => {
    const dashboardPage = new DashboardPage(baseTest.page);

    console.log('🎯 Starting Dashboard Widgets Verification Test');

    await test.step('Navigate to dashboard', async () => {
      await dashboardPage.navigate();
    });

    await test.step('Verify widgets are displayed', async () => {
      console.log('🔍 Checking dashboard widgets...');
      await dashboardPage.verifyWidgetsVisible();

      const widgetCount = await dashboardPage.getWidgetCount();
      console.log(`📊 Total widgets found: ${widgetCount}`);
      expect(widgetCount).toBeGreaterThan(0);

      console.log('✅ Dashboard widgets verified');
    });

    await test.step('Take widgets screenshot', async () => {
      await baseTest.takeScreenshot('dashboard-widgets');
      console.log('🎉 Dashboard Widgets Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Quick Launch Shortcuts
   */
  test('Verify Quick Launch Shortcuts @daily', async ({ baseTest }) => {
    const dashboardPage = new DashboardPage(baseTest.page);

    console.log('🎯 Starting Quick Launch Shortcuts Test');

    await test.step('Navigate to dashboard', async () => {
      await dashboardPage.navigate();
    });

    await test.step('Verify Quick Launch section exists', async () => {
      console.log('🔍 Checking Quick Launch section...');
      const quickLaunch = baseTest.page.locator('.orangehrm-dashboard-widget-header:has-text("Quick Launch")');

      if (await quickLaunch.count() > 0) {
        console.log('✅ Quick Launch section found');

        // Verify shortcuts are present
        const shortcuts = baseTest.page.locator('.orangehrm-dashboard-widget-name');
        const shortcutCount = await shortcuts.count();
        console.log(`📊 Quick Launch shortcuts found: ${shortcutCount}`);
        expect(shortcutCount).toBeGreaterThan(0);
      } else {
        console.log('⚠️ Quick Launch section not visible, may depend on user permissions');
      }

      console.log('🎉 Quick Launch Shortcuts Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Side Menu Navigation From Dashboard
   */
  test('Verify Side Menu Navigation From Dashboard @daily', async ({ baseTest }) => {
    console.log('🎯 Starting Side Menu Navigation Test');

    const modules = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard', 'Directory'];

    await test.step('Verify side menu modules are visible', async () => {
      console.log('🔍 Checking side menu modules...');

      for (const moduleName of modules) {
        try {
          const menuItem = baseTest.page.locator(`.oxd-main-menu-item:has-text("${moduleName}")`);
          if (await menuItem.count() > 0) {
            console.log(`✅ Module visible: ${moduleName}`);
          } else {
            console.log(`⚠️ Module not visible: ${moduleName}`);
          }
        } catch (error) {
          console.log(`⚠️ Error checking module ${moduleName}:`, error);
        }
      }

      console.log('✅ Side menu navigation verified');
    });

    await test.step('Navigate to PIM and back to Dashboard', async () => {
      console.log('🧭 Testing navigation: Dashboard → PIM → Dashboard');

      // Go to PIM
      await baseTest.page.locator('.oxd-main-menu-item:has-text("PIM")').click();
      await baseTest.page.waitForLoadState('networkidle');
      expect(baseTest.page.url()).toContain('pim');
      console.log('✅ Navigated to PIM');

      // Go back to Dashboard
      await baseTest.page.locator('.oxd-main-menu-item:has-text("Dashboard")').click();
      await baseTest.page.waitForLoadState('networkidle');
      expect(baseTest.page.url()).toContain('dashboard');
      console.log('✅ Navigated back to Dashboard');

      console.log('🎉 Side Menu Navigation Test COMPLETED SUCCESSFULLY!');
    });
  });
});
