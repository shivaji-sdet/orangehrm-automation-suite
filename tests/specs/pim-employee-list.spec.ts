import { test, expect } from '../fixtures/base.fixture';
import { credentials, employeeData } from '../data/test-data';

test.describe('PIM - Employee List', () => {
  test.beforeEach(async ({ loginPage, pimPage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await pimPage.navigateToEmployeeList();
  });

  test('employee list shows records @smoke', async ({ pimPage }) => {
    await expect(pimPage.tableRows.first()).toBeVisible({ timeout: 15000 });
  });

  test('add employee button is visible @smoke', async ({ pimPage }) => {
    await expect(pimPage.addButton).toBeVisible();
  });

  test('search by employee name returns results @daily', async ({ pimPage }) => {
    await pimPage.searchByName(employeeData.search.validName);
    expect(await pimPage.getRowCount()).toBeGreaterThan(0);
  });

  test('reset search restores full list @daily', async ({ pimPage }) => {
    await pimPage.searchByName(employeeData.search.invalidName);
    await pimPage.resetSearch();
    await expect(pimPage.tableRows.first()).toBeVisible();
  });
});
