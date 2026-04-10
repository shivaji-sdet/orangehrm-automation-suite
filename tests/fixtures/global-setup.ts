import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const AUTH_STATES_DIR = path.join(__dirname, '../../.auth-states');

async function globalSetup(_config: FullConfig) {
  for (const dir of [
    AUTH_STATES_DIR,
    path.join(__dirname, '../../screenshots'),
    path.join(__dirname, '../../test-results'),
  ]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

export default globalSetup;
