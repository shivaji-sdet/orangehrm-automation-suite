import { test, expect } from '../fixtures/base.fixture';
import { credentials } from '../data/test-data';

test.describe('Recruitment', () => {
  test.beforeEach(async ({ loginPage, recruitmentPage }) => {
    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await recruitmentPage.navigate();
  });

  test('recruitment module loads @smoke', async ({ page }) => {
    expect(page.url()).toContain('recruitment');
  });

  test('candidates and vacancies tabs are visible @daily', async ({ recruitmentPage }) => {
    expect(await recruitmentPage.subMenuTabs.count()).toBeGreaterThan(0);
  });
});
