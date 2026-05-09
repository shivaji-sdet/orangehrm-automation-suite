import { test, expect } from '../fixtures/base.fixture';
import { credentials } from '../data/test-data';

test.describe('Leave Management', () => {
  test.beforeEach(async ({ loginPage, leavePage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await leavePage.navigate();
  });

  test('leave module loads @smoke', async ({ page }) => {
    expect(page.url()).toContain('leave');
  });

  test('leave list page loads @smoke', async ({ page, leavePage }) => {
    await leavePage.navigateToLeaveList();
    await expect(leavePage.searchButton).toBeVisible();
    expect(page.url()).toContain('viewLeaveList');
  });

  test('apply leave page loads @daily', async ({ page, leavePage }) => {
    await leavePage.navigateToApply();
    expect(page.url()).toContain('applyLeave');
  });

  test('leave sub-menu tabs are visible @daily', async ({ leavePage }) => {
    expect(await leavePage.subMenuTabs.count()).toBeGreaterThan(0);
  });
});
