import { Page, expect } from '@playwright/test';

/**
 * Dashboard Page Object
 * OrangeHRM Dashboard module interactions
 * 
 * OrangeHRM Automation Suite
 */
export class DashboardPage {
  readonly page: Page;

  readonly selectors = {
    dashboardGrid: '.orangehrm-dashboard-widget-header',
    widgetCard: '.orangehrm-dashboard-widget',
    quickLaunchCard: '.orangehrm-dashboard-widget-name',
    timeAtWork: '.orangehrm-dashboard-widget-header:has-text("Time at Work")',
    myActions: '.orangehrm-dashboard-widget-header:has-text("My Actions")',
    quickLaunch: '.orangehrm-dashboard-widget-header:has-text("Quick Launch")',
    employeesOnLeave: '.orangehrm-dashboard-widget-header:has-text("Employees on Leave Today")',
    employeeDistribution: '.orangehrm-dashboard-widget-header:has-text("Employee Distribution by Sub Unit")',
    employeeDistributionChart: 'canvas',

    // Quick Launch shortcuts
    assignLeave: '.orangehrm-dashboard-widget-name:has-text("Assign Leave")',
    leaveList: '.orangehrm-dashboard-widget-name:has-text("Leave List")',
    timesheets: '.orangehrm-dashboard-widget-name:has-text("Timesheets")',
    applyLeave: '.orangehrm-dashboard-widget-name:has-text("Apply Leave")',
    myLeave: '.orangehrm-dashboard-widget-name:has-text("My Leave")',
    myTimesheets: '.orangehrm-dashboard-widget-name:has-text("My Timesheet")',
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to Dashboard
   */
  async navigate() {
    console.log('🧭 Navigating to Dashboard...');
    await this.page.locator('.oxd-main-menu-item:has-text("Dashboard")').click();
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Navigated to Dashboard');
  }

  /**
   * Verify dashboard page is loaded
   */
  async verifyDashboardLoaded() {
    console.log('🔍 Verifying Dashboard is loaded...');

    const grid = this.page.locator(this.selectors.dashboardGrid).first();
    await grid.waitFor({ state: 'visible', timeout: 15000 });

    // Verify URL contains dashboard
    expect(this.page.url()).toContain('dashboard');
    console.log('✅ Dashboard page verified');
  }

  /**
   * Verify dashboard widgets are visible
   */
  async verifyWidgetsVisible() {
    console.log('🔍 Verifying dashboard widgets...');

    const widgets = this.page.locator(this.selectors.widgetCard);
    const count = await widgets.count();
    console.log(`📊 Found ${count} dashboard widgets`);
    expect(count).toBeGreaterThan(0);

    console.log('✅ Dashboard widgets verified');
  }

  /**
   * Click Quick Launch shortcut
   */
  async clickQuickLaunch(shortcutName: string) {
    console.log(`🚀 Clicking Quick Launch: ${shortcutName}`);
    const shortcut = this.page.locator(`.orangehrm-dashboard-widget-name:has-text("${shortcutName}")`);
    await shortcut.waitFor({ state: 'visible', timeout: 10000 });
    await shortcut.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Clicked Quick Launch: ${shortcutName}`);
  }

  /**
   * Get widget count
   */
  async getWidgetCount(): Promise<number> {
    const widgets = this.page.locator(this.selectors.widgetCard);
    return await widgets.count();
  }
}
