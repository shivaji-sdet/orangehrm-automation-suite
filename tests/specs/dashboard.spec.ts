import { test, expect } from '../fixtures/base.fixture';
import { credentials } from '../data/test-data';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
  });

  test('dashboard loads after login @smoke', async ({ page, dashboardPage }) => {
    await expect(dashboardPage.menu).toBeVisible();
    expect(page.url()).toContain('dashboard');
  });

  test('dashboard widgets are visible @smoke', async ({ dashboardPage }) => {
    await expect(dashboardPage.widgets.first()).toBeVisible();
  });

  test('quick launch section is visible @daily', async ({ dashboardPage }) => {
    await expect(dashboardPage.quickLaunch).toBeVisible();
  });

  test('side menu navigates to PIM @daily', async ({ page, pimPage }) => {
    await pimPage.navigateToEmployeeList();
    expect(page.url()).toContain('pim');
  });
});
