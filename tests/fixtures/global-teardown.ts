import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
  // Add cleanup logic here if needed (e.g. delete temp test data)
}

export default globalTeardown;
