import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Setup for OrangeHRM Automation Suite
 * Runs once before all tests
 */

export const AUTH_STATES_DIR = path.join(__dirname, '../../.auth-states');

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Global Setup for OrangeHRM Automation Suite...');
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'staging'}`);
  console.log(`🌐 Base URL: ${config.projects[0]?.use?.baseURL || 'Not configured'}`);

  // Create auth states directory if it doesn't exist
  if (!fs.existsSync(AUTH_STATES_DIR)) {
    fs.mkdirSync(AUTH_STATES_DIR, { recursive: true });
    console.log('📁 Created auth states directory');
  }

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, '../../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log('📁 Created screenshots directory');
  }

  // Create test-results directory if it doesn't exist
  const testResultsDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
    console.log('📁 Created test-results directory');
  }

  console.log('✅ Global Setup completed successfully');
}

export default globalSetup;
