import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';
import { AdminPage } from '../pages/AdminPage';
import { LeavePage } from '../pages/LeavePage';
import { RecruitmentPage } from '../pages/RecruitmentPage';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PIMPage;
  adminPage: AdminPage;
  leavePage: LeavePage;
  recruitmentPage: RecruitmentPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  dashboardPage: async ({ page }, use) => { await use(new DashboardPage(page)); },
  pimPage: async ({ page }, use) => { await use(new PIMPage(page)); },
  adminPage: async ({ page }, use) => { await use(new AdminPage(page)); },
  leavePage: async ({ page }, use) => { await use(new LeavePage(page)); },
  recruitmentPage: async ({ page }, use) => { await use(new RecruitmentPage(page)); },
});

export { expect } from '@playwright/test';
