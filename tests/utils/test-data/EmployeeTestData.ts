/**
 * Employee Test Data Factory
 * Provides test data for PIM/Employee-related tests
 * 
 * OrangeHRM Automation Suite
 */
export class EmployeeTestDataFactory {

  /**
   * Generate random employee data
   */
  static generateEmployee() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

    return {
      firstName: `Auto${randomStr}`,
      middleName: 'T',
      lastName: `Test${timestamp.toString().slice(-4)}`,
      employeeId: `EMP${timestamp.toString().slice(-6)}`,
      fullName: '',
    };
  }

  /**
   * Get predefined employee data for specific test scenarios
   */
  static getStandardEmployee() {
    return {
      firstName: 'John',
      middleName: 'M',
      lastName: 'Anderson',
      employeeId: `EMP${Date.now().toString().slice(-6)}`,
    };
  }

  /**
   * Get employee data with login credentials
   */
  static getEmployeeWithLogin() {
    const employee = this.generateEmployee();
    const timestamp = Date.now();

    return {
      ...employee,
      username: `user_${timestamp.toString().slice(-6)}`,
      password: 'AutoTest@123',
      confirmPassword: 'AutoTest@123',
    };
  }

  /**
   * Get multiple employees for bulk test scenarios
   */
  static getBulkEmployees(count: number = 3) {
    const employees = [];
    for (let i = 0; i < count; i++) {
      employees.push(this.generateEmployee());
    }
    return employees;
  }

  /**
   * Get employee search test data
   */
  static getSearchTestData() {
    return {
      validName: 'Paul',
      validId: '0001',
      invalidName: 'ZZZZNONEXISTENT',
      invalidId: '999999',
      partialName: 'Jo',
    };
  }
}
