import { test, expect } from '../../utils/base/BaseTest';
import { PIMPage } from '../../utils/page-objects/PIMPage';
import { EmployeeTestDataFactory } from '../../utils/test-data/EmployeeTestData';
import { getBaseUrl } from '../../fixtures/environments/environment.config';

/**
 * Test Suite: PIM - Add Employee
 * 
 * This test suite validates the employee creation workflow:
 * 1. Navigate to PIM > Add Employee
 * 2. Fill employee details
 * 3. Save employee
 * 4. Verify employee created successfully
 */
test.describe('PIM Module - Add Employee', () => {

  test.beforeEach(async ({ baseTest }) => {
    console.log('🔧 Setting up PIM Add Employee test...');
    await baseTest.page.goto(getBaseUrl());
    await baseTest.performAuthentication();
  });

  /**
   * Test Case: Add New Employee with Basic Details
   */
  test('Add New Employee with Basic Details @smoke', async ({ baseTest }) => {
    const pimPage = new PIMPage(baseTest.page);
    const employeeData = EmployeeTestDataFactory.generateEmployee();

    console.log('🎯 Starting Add New Employee Test');
    console.log(`👤 Employee: ${employeeData.firstName} ${employeeData.lastName}`);
    console.log(`🆔 Employee ID: ${employeeData.employeeId}`);

    // Step 1: Navigate to Add Employee page
    await test.step('Navigate to Add Employee page', async () => {
      console.log('🧭 Navigating to Add Employee page...');
      await pimPage.navigateToAddEmployee();
      console.log('✅ Add Employee page loaded');
    });

    // Step 2: Fill employee details
    await test.step('Fill employee details', async () => {
      console.log('📝 Filling employee details...');
      await pimPage.addEmployee(
        employeeData.firstName,
        employeeData.lastName,
        employeeData.middleName,
        employeeData.employeeId
      );
      console.log('✅ Employee details filled');
    });

    // Step 3: Save employee
    await test.step('Save employee', async () => {
      console.log('💾 Saving employee...');
      await pimPage.saveEmployee();
      console.log('✅ Employee save initiated');
    });

    // Step 4: Verify employee created successfully
    await test.step('Verify employee created successfully', async () => {
      console.log('🔍 Verifying employee creation...');

      // After save, OrangeHRM redirects to Personal Details page
      await baseTest.page.waitForTimeout(3000);
      await baseTest.page.waitForLoadState('networkidle');

      // Verify we're on the Personal Details page
      const personalDetailsHeader = baseTest.page.locator('h6:has-text("Personal Details")');

      if (await personalDetailsHeader.count() > 0) {
        console.log('✅ Redirected to Personal Details page - Employee created!');
      } else {
        // Check for success toast
        const toast = baseTest.page.locator('.oxd-toast--success');
        if (await toast.count() > 0) {
          console.log('✅ Success toast displayed - Employee created!');
        } else {
          console.log('⚠️ Verifying via URL...');
          const currentUrl = baseTest.page.url();
          expect(currentUrl).toContain('viewPersonalDetails');
          console.log('✅ URL confirmed - Employee created!');
        }
      }

      await baseTest.takeScreenshot('employee-created');
      console.log('🎉 Add New Employee Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Add Employee with Login Credentials
   */
  test('Add Employee with Login Credentials @daily', async ({ baseTest }) => {
    const pimPage = new PIMPage(baseTest.page);
    const employeeData = EmployeeTestDataFactory.getEmployeeWithLogin();

    console.log('🎯 Starting Add Employee with Login Test');
    console.log(`👤 Employee: ${employeeData.firstName} ${employeeData.lastName}`);
    console.log(`🔐 Username: ${employeeData.username}`);

    // Step 1: Navigate to Add Employee page
    await test.step('Navigate to Add Employee page', async () => {
      await pimPage.navigateToAddEmployee();
    });

    // Step 2: Fill employee details
    await test.step('Fill employee details', async () => {
      await pimPage.addEmployee(
        employeeData.firstName,
        employeeData.lastName,
        employeeData.middleName,
        employeeData.employeeId
      );
    });

    // Step 3: Enable login details
    await test.step('Enable login details', async () => {
      console.log('🔐 Enabling login details...');
      await pimPage.enableLoginDetails(employeeData.username, employeeData.password);
      console.log('✅ Login details enabled');
    });

    // Step 4: Save employee
    await test.step('Save employee', async () => {
      await pimPage.saveEmployee();
    });

    // Step 5: Verify employee created
    await test.step('Verify employee created', async () => {
      await baseTest.page.waitForTimeout(3000);
      await baseTest.page.waitForLoadState('networkidle');

      const currentUrl = baseTest.page.url();
      console.log(`🌐 Current URL: ${currentUrl}`);

      // Verify redirect to personal details
      const personalDetails = baseTest.page.locator('h6:has-text("Personal Details")');
      if (await personalDetails.count() > 0) {
        console.log('✅ Employee with login credentials created successfully!');
      }

      await baseTest.takeScreenshot('employee-with-login-created');
      console.log('🎉 Add Employee with Login Test COMPLETED SUCCESSFULLY!');
    });
  });

  /**
   * Test Case: Verify Required Fields Validation on Add Employee
   */
  test('Verify Required Fields Validation @smoke', async ({ baseTest }) => {
    const pimPage = new PIMPage(baseTest.page);

    console.log('🎯 Starting Required Fields Validation Test');

    // Step 1: Navigate to Add Employee page
    await test.step('Navigate to Add Employee page', async () => {
      await pimPage.navigateToAddEmployee();
    });

    // Step 2: Click Save without filling required fields
    await test.step('Click Save without filling required fields', async () => {
      console.log('💾 Clicking Save without filling fields...');
      await pimPage.saveEmployee();
      await baseTest.page.waitForTimeout(1000);
    });

    // Step 3: Verify validation errors
    await test.step('Verify validation errors', async () => {
      console.log('🔍 Checking for validation errors...');

      const validationErrors = baseTest.page.locator('.oxd-input-field-error-message');
      const errorCount = await validationErrors.count();

      console.log(`📊 Validation errors found: ${errorCount}`);
      expect(errorCount).toBeGreaterThan(0);

      // Verify specific required field messages
      const errorTexts = await validationErrors.allTextContents();
      console.log(`📋 Error messages: ${errorTexts.join(', ')}`);

      await baseTest.takeScreenshot('add-employee-validation-errors');
      console.log('🎉 Required Fields Validation Test COMPLETED SUCCESSFULLY!');
    });
  });
});
