import { test, expect } from '../fixtures/base.fixture';
import { credentials, employeeData } from '../data/test-data';

test.describe('PIM - Add Employee', () => {
  test.beforeEach(async ({ loginPage, pimPage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await pimPage.navigateToAddEmployee();
  });

  test('add employee with basic details @smoke', async ({ page, pimPage }) => {
    const employee = employeeData.generate();
    await pimPage.fillEmployeeDetails(employee.firstName, employee.lastName, undefined, employee.employeeId);
    await pimPage.saveEmployee();
    await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 30000 });
  });

  test('add employee with login credentials @daily', async ({ page, pimPage }) => {
    const employee = employeeData.withLogin();
    await pimPage.fillEmployeeDetails(employee.firstName, employee.lastName);
    await pimPage.enableLoginCredentials(employee.username, employee.password);
    await pimPage.saveEmployee();
    await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 30000 });
  });

  test('required fields validation on empty submit @smoke', async ({ pimPage }) => {
    await pimPage.saveEmployee();
    await expect(pimPage.validationErrors.first()).toBeVisible();
  });
});
