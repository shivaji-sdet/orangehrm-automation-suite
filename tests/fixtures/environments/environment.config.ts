/**
 * Environment configuration for different test environments
 * Centralized configuration management for CI/CD and local development
 * 
 * OrangeHRM Automation Suite
 */

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiUrl: string;
  credentials: {
    adminUsername: string;
    adminPassword: string;
    testUsername?: string;
    testPassword?: string;
  };
  timeouts: {
    navigation: number;
    element: number;
    manualLogin: number;
    formSubmission: number;
    short: number;
    medium: number;
    long: number;
  };
  features: {
    manualLogin: boolean;
    screenshots: boolean;
    video: boolean;
    trace: boolean;
  };
}

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentEnvironment: EnvironmentConfig;

  private constructor() {
    this.currentEnvironment = this.loadEnvironment();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  /**
   * Load environment configuration based on environment variables
   */
  private loadEnvironment(): EnvironmentConfig {
    const env = process.env.NODE_ENV || 'staging';

    // Load environment variables from .env file if available
    this.loadEnvironmentVariables();

    switch (env.toLowerCase()) {
      case 'production':
        return this.getProductionConfig();
      case 'staging':
        return this.getStagingConfig();
      case 'development':
        return this.getDevelopmentConfig();
      default:
        return this.getStagingConfig();
    }
  }

  /**
   * Load environment variables from .env file if available
   */
  private loadEnvironmentVariables() {
    try {
      const dotenv = require('dotenv');
      const result = dotenv.config();
      if (result.error) {
        console.log('⚠️ Error loading .env file:', result.error.message);
      } else {
        console.log('✅ Loaded .env file successfully');
        console.log(`🔧 NAVIGATION_TIMEOUT from env: ${process.env.NAVIGATION_TIMEOUT}`);
      }
    } catch (error) {
      console.log('dotenv not available, using system environment variables');
    }
  }

  /**
   * Get current environment configuration
   */
  getCurrentEnvironment(): EnvironmentConfig {
    return this.currentEnvironment;
  }

  /**
   * Override environment configuration (useful for testing)
   */
  setEnvironment(environment: EnvironmentConfig): void {
    this.currentEnvironment = environment;
  }

  /**
   * Get environment-specific configuration
   */
  getConfig(): EnvironmentConfig {
    return this.currentEnvironment;
  }

  /**
   * Get base URL for current environment
   */
  getBaseUrl(): string {
    return this.currentEnvironment.baseUrl;
  }

  /**
   * Get API URL for current environment
   */
  getApiUrl(): string {
    return this.currentEnvironment.apiUrl;
  }

  /**
   * Get credentials for current environment
   */
  getCredentials() {
    return this.currentEnvironment.credentials;
  }

  /**
   * Get timeouts for current environment
   */
  getTimeouts() {
    return this.currentEnvironment.timeouts;
  }

  /**
   * Get features for current environment
   */
  getFeatures() {
    return this.currentEnvironment.features;
  }

  /**
   * Production environment configuration
   */
  private getProductionConfig(): EnvironmentConfig {
    return {
      name: 'production',
      baseUrl: process.env.PROD_BASE_URL || 'https://opensource-demo.orangehrmlive.com',
      apiUrl: process.env.PROD_API_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',
      credentials: {
        adminUsername: process.env.PROD_ADMIN_USERNAME || '',
        adminPassword: process.env.PROD_ADMIN_PASSWORD || '',
      },
      timeouts: {
        navigation: 30000,
        element: 15000,
        manualLogin: 120000,
        formSubmission: 30000,
        short: 5000,
        medium: 15000,
        long: 30000,
      },
      features: {
        manualLogin: false,
        screenshots: true,
        video: false,
        trace: false,
      },
    };
  }

  /**
   * Staging environment configuration with environment variable support
   */
  private getStagingConfig(): EnvironmentConfig {
    return {
      name: 'staging',
      baseUrl: process.env.STAGING_BASE_URL || 'https://opensource-demo.orangehrmlive.com',
      apiUrl: process.env.STAGING_API_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',
      credentials: {
        adminUsername: process.env.STAGING_ADMIN_USERNAME || 'Admin',
        adminPassword: process.env.STAGING_ADMIN_PASSWORD || 'admin123',
      },
      timeouts: {
        navigation: parseInt(process.env.NAVIGATION_TIMEOUT || '60000'),
        element: parseInt(process.env.ELEMENT_TIMEOUT || '30000'),
        manualLogin: parseInt(process.env.MANUAL_LOGIN_TIMEOUT || '600000'),
        formSubmission: parseInt(process.env.FORM_SUBMISSION_TIMEOUT || '60000'),
        short: parseInt(process.env.SHORT_TIMEOUT || '10000'),
        medium: parseInt(process.env.MEDIUM_TIMEOUT || '30000'),
        long: parseInt(process.env.LONG_TIMEOUT || '60000'),
      },
      features: {
        manualLogin: process.env.MANUAL_LOGIN !== 'false',
        screenshots: process.env.SCREENSHOT_MODE !== 'never',
        video: process.env.VIDEO_MODE !== 'never',
        trace: process.env.TRACE_MODE !== 'never',
      },
    };
  }

  /**
   * Development environment configuration
   */
  private getDevelopmentConfig(): EnvironmentConfig {
    return {
      name: 'development',
      baseUrl: process.env.DEV_BASE_URL || 'https://opensource-demo.orangehrmlive.com',
      apiUrl: process.env.DEV_API_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',
      credentials: {
        adminUsername: process.env.DEV_ADMIN_USERNAME || 'Admin',
        adminPassword: process.env.DEV_ADMIN_PASSWORD || 'admin123',
        testUsername: process.env.DEV_TEST_USERNAME || 'Admin',
        testPassword: process.env.DEV_TEST_PASSWORD || 'admin123',
      },
      timeouts: {
        navigation: 120000,
        element: 60000,
        manualLogin: 600000,
        formSubmission: 120000,
        short: 15000,
        medium: 60000,
        long: 120000,
      },
      features: {
        manualLogin: true,
        screenshots: true,
        video: true,
        trace: true,
      },
    };
  }
}

/**
 * Convenience function to get environment configuration
 */
export function getEnvironment(): EnvironmentConfig {
  return EnvironmentManager.getInstance().getConfig();
}

/**
 * Convenience function to get base URL
 */
export function getBaseUrl(): string {
  return EnvironmentManager.getInstance().getBaseUrl();
}

/**
 * Convenience function to get API URL
 */
export function getApiUrl(): string {
  return EnvironmentManager.getInstance().getApiUrl();
}

/**
 * Convenience function to get credentials
 */
export function getCredentials() {
  return EnvironmentManager.getInstance().getCredentials();
}

/**
 * Convenience function to get timeouts
 */
export function getTimeouts() {
  return EnvironmentManager.getInstance().getTimeouts();
}

/**
 * Convenience function to get features
 */
export function getFeatures() {
  return EnvironmentManager.getInstance().getFeatures();
}
