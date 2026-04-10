import { getCredentials, getEnvironment } from '../../fixtures/environments/environment.config';

/**
 * Authentication Test Data Factory
 * Provides test data for authentication-related tests
 * 
 * OrangeHRM Automation Suite
 */
export class AuthTestDataFactory {

  /**
   * Get authentication credentials for current environment
   */
  static getAuthCredentials() {
    const credentials = getCredentials();
    const environment = getEnvironment();

    return {
      username: credentials.adminUsername || 'Admin',
      password: credentials.adminPassword || 'admin123',
      environment: environment.name,
      baseUrl: environment.baseUrl,
    };
  }

  /**
   * Get invalid credentials for negative testing
   */
  static getInvalidCredentials() {
    return {
      invalidUsername: 'InvalidUser',
      invalidPassword: 'WrongPass123',
      emptyUsername: '',
      emptyPassword: '',
      specialCharsUsername: 'Admin@#$%',
      specialCharsPassword: '!@#$%^&*()',
    };
  }

  /**
   * Get test user data for creating new users
   */
  static getTestUserData() {
    const timestamp = Date.now();
    return {
      username: `AutoTest_${timestamp}`,
      password: 'TestPass@123',
      role: 'Admin',
      status: 'Enabled',
    };
  }
}
