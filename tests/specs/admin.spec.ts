import { test, expect } from '../fixtures/base.fixture';
import { credentials } from '../data/test-data';

test.describe('Admin - User Management', () => {
  test.beforeEach(async ({ loginPage, adminPage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await adminPage.navigate();
  });

  test('admin module loads @smoke', async ({ page }) => {
    expect(page.url()).toContain('admin');
  });

  test('add user button is visible @smoke', async ({ adminPage }) => {
    await expect(adminPage.addButton).toBeVisible();
  });

  test('search by username returns results @daily', async ({ adminPage }) => {
    await adminPage.searchByUsername('Admin');
    expect(await adminPage.getRowCount()).toBeGreaterThan(0);
  });

  test('job and organization sub-menus are accessible @daily', async ({ adminPage }) => {
    await adminPage.navigateToSubMenu('Job');
    await adminPage.navigate();
    await adminPage.navigateToSubMenu('Organization');
  });
});
