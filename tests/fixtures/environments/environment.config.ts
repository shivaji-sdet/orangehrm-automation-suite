import * as dotenv from 'dotenv';
dotenv.config();

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiUrl: string;
  credentials: {
    adminUsername: string;
    adminPassword: string;
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

export const config: EnvironmentConfig = {
  name: process.env.NODE_ENV || 'staging',
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

export const getEnvironment = (): EnvironmentConfig => config;
export const getBaseUrl = (): string => config.baseUrl;
export const getApiUrl = (): string => config.apiUrl;
export const getCredentials = () => config.credentials;
export const getTimeouts = () => config.timeouts;
export const getFeatures = () => config.features;
