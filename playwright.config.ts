import { defineConfig, devices } from '@playwright/test';
import { getEnvironment } from './tests/fixtures/environments/environment.config';

/**
 * Playwright Configuration - Optimized for CI/CD and Local Development
 *
 * Features:
 * - Environment-based configuration
 * - Chrome browser prioritized for stability
 * - CI/CD pipeline ready
 * - Comprehensive reporting
 * - Proper timeout management
 *
 * @see https://playwright.dev/docs/test-configuration
 */

// Load environment configuration
const environment = getEnvironment();

export default defineConfig({
  // Test directory structure
  testDir: './tests',
  testIgnore: ['**/dist/**', '**/node_modules/**', '**/downloads/**'],

  // Output directories
  outputDir: 'test-results',

  // Test execution settings
  fullyParallel: !process.env.CI, // Parallel locally, sequential in CI for stability
  forbidOnly: !!process.env.CI, // Prevent test.only in CI
  retries: process.env.CI ? 2 : 1, // Retry failed tests in CI and locally
  workers: process.env.CI ? 1 : undefined, // Single worker in CI, auto-detect locally

  // Timeout configuration based on environment
  timeout: environment.timeouts.navigation + environment.timeouts.formSubmission, // Total test timeout
  expect: {
    timeout: environment.timeouts.element, // Assertion timeout
  },

  // Global test setup
  globalSetup: require.resolve('./tests/fixtures/global-setup.ts'),
  globalTeardown: require.resolve('./tests/fixtures/global-teardown.ts'),

  // Reporter configuration - optimized for CI/CD
  reporter: process.env.CI
    ? [
        ['github'], // GitHub Actions integration
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['blob', { outputDir: 'test-results/blob-report' }] // For report merging
      ]
    : [
        ['html', { open: 'on-failure' }], // Auto-open on failure locally
        ['list'], // Console output for local development
        ['json', { outputFile: 'test-results/results.json' }]
      ],

  // Shared test configuration
  use: {
    // Environment-based base URL
    baseURL: environment.baseUrl,

    // Browser context settings
    viewport: { width: 1920, height: 1080 }, // Standard desktop resolution
    ignoreHTTPSErrors: true, // Handle staging SSL issues

    // Recording and debugging
    trace: environment.features.trace ? 'on-first-retry' : 'off',
    screenshot: 'only-on-failure', // Always capture screenshots on failure
    video: process.env.RECORD_VIDEO === 'always' ? 'on' : 'off',

    // Navigation settings
    navigationTimeout: environment.timeouts.navigation,
    actionTimeout: environment.timeouts.element,

    // Additional context options
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Browser projects - Chrome prioritized for stability
  projects: [
    // Primary browser for CI/CD and main testing
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Use actual Chrome browser for maximum compatibility
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-dev-shm-usage', // Overcome limited resource problems in CI
            '--no-sandbox', // Required for CI environments
          ],
        },
      },
    },

    // Additional browsers for cross-browser testing (optional)
    ...(process.env.CROSS_BROWSER_TESTING === 'true' ? [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
      {
        name: 'edge',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
      },
    ] : []),

    // Mobile testing (optional, enabled via environment variable)
    ...(process.env.MOBILE_TESTING === 'true' ? [
      {
        name: 'mobile-chrome',
        use: { ...devices['Pixel 5'] },
      },
      {
        name: 'mobile-safari',
        use: { ...devices['iPhone 12'] },
      },
    ] : []),
  ],

  // Web server configuration (if needed for local development)
  webServer: process.env.START_LOCAL_SERVER === 'true' ? {
    command: 'npm run start:dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  } : undefined,
});
