import { test, expect } from '../fixtures/base.fixture';
import { credentials } from '../data/test-data';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login with valid credentials @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await expect(dashboardPage.menu).toBeVisible();
  });

  test('login with invalid credentials shows error @smoke', async ({ loginPage }) => {
    await loginPage.login(credentials.invalid.username, credentials.invalid.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  test('login with empty credentials shows validation @smoke', async ({ loginPage }) => {
    await loginPage.submit();
    await expect(loginPage.validationErrors.first()).toBeVisible();
  });
});
