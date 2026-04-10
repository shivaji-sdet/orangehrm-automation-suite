import { Page } from '@playwright/test';

/**
 * Navigation Helper - OrangeHRM sidebar and menu navigation
 * Provides methods to navigate between modules and sub-menus
 * 
 * OrangeHRM Automation Suite
 */
export class NavigationHelper {

  /**
   * OrangeHRM Main Menu Modules
   */
  static readonly MODULES = {
    ADMIN: 'Admin',
    PIM: 'PIM',
    LEAVE: 'Leave',
    TIME: 'Time',
    RECRUITMENT: 'Recruitment',
    MY_INFO: 'My Info',
    PERFORMANCE: 'Performance',
    DASHBOARD: 'Dashboard',
    DIRECTORY: 'Directory',
    MAINTENANCE: 'Maintenance',
    CLAIM: 'Claim',
    BUZZ: 'Buzz',
  } as const;

  /**
   * Navigate to a main menu module
   */
  static async navigateToModule(page: Page, moduleName: string) {
    console.log(`🧭 Navigating to: ${moduleName}`);
    const menuItem = page.locator(`.oxd-main-menu-item:has-text("${moduleName}")`);
    await menuItem.waitFor({ state: 'visible', timeout: 15000 });
    await menuItem.click();
    await page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to ${moduleName}`);
  }

  /**
   * Navigate to Admin module
   */
  static async goToAdmin(page: Page) {
    await this.navigateToModule(page, this.MODULES.ADMIN);
  }

  /**
   * Navigate to PIM module
   */
  static async goToPIM(page: Page) {
    await this.navigateToModule(page, this.MODULES.PIM);
  }

  /**
   * Navigate to Leave module
   */
  static async goToLeave(page: Page) {
    await this.navigateToModule(page, this.MODULES.LEAVE);
  }

  /**
   * Navigate to Recruitment module
   */
  static async goToRecruitment(page: Page) {
    await this.navigateToModule(page, this.MODULES.RECRUITMENT);
  }

  /**
   * Navigate to Dashboard module
   */
  static async goToDashboard(page: Page) {
    await this.navigateToModule(page, this.MODULES.DASHBOARD);
  }

  /**
   * Navigate to My Info module
   */
  static async goToMyInfo(page: Page) {
    await this.navigateToModule(page, this.MODULES.MY_INFO);
  }

  /**
   * Navigate to Time module
   */
  static async goToTime(page: Page) {
    await this.navigateToModule(page, this.MODULES.TIME);
  }

  /**
   * Navigate to Performance module
   */
  static async goToPerformance(page: Page) {
    await this.navigateToModule(page, this.MODULES.PERFORMANCE);
  }

  /**
   * Navigate to Directory module
   */
  static async goToDirectory(page: Page) {
    await this.navigateToModule(page, this.MODULES.DIRECTORY);
  }

  /**
   * Navigate to Admin sub-menu (e.g., User Management, Job, Organization)
   */
  static async navigateToAdminSubMenu(page: Page, topMenu: string, subMenu?: string) {
    await this.goToAdmin(page);
    await page.waitForTimeout(500);

    // Click top-level tab
    const topTab = page.locator(`.oxd-topbar-body-nav-tab:has-text("${topMenu}")`);
    await topTab.waitFor({ state: 'visible', timeout: 10000 });
    await topTab.click();

    if (subMenu) {
      await page.waitForTimeout(300);
      const subMenuItem = page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`);
      await subMenuItem.waitFor({ state: 'visible', timeout: 10000 });
      await subMenuItem.click();
    }

    await page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to Admin > ${topMenu}${subMenu ? ` > ${subMenu}` : ''}`);
  }

  /**
   * Navigate to PIM sub-menu
   */
  static async navigateToPIMSubMenu(page: Page, topMenu: string, subMenu?: string) {
    await this.goToPIM(page);
    await page.waitForTimeout(500);

    const topTab = page.locator(`.oxd-topbar-body-nav-tab:has-text("${topMenu}")`);
    await topTab.waitFor({ state: 'visible', timeout: 10000 });
    await topTab.click();

    if (subMenu) {
      await page.waitForTimeout(300);
      const subMenuItem = page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`);
      await subMenuItem.waitFor({ state: 'visible', timeout: 10000 });
      await subMenuItem.click();
    }

    await page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to PIM > ${topMenu}${subMenu ? ` > ${subMenu}` : ''}`);
  }

  /**
   * Navigate to Leave sub-menu
   */
  static async navigateToLeaveSubMenu(page: Page, topMenu: string, subMenu?: string) {
    await this.goToLeave(page);
    await page.waitForTimeout(500);

    const topTab = page.locator(`.oxd-topbar-body-nav-tab:has-text("${topMenu}")`);
    await topTab.waitFor({ state: 'visible', timeout: 10000 });
    await topTab.click();

    if (subMenu) {
      await page.waitForTimeout(300);
      const subMenuItem = page.locator(`.oxd-dropdown-menu a:has-text("${subMenu}")`);
      await subMenuItem.waitFor({ state: 'visible', timeout: 10000 });
      await subMenuItem.click();
    }

    await page.waitForLoadState('networkidle');
    console.log(`✅ Navigated to Leave > ${topMenu}${subMenu ? ` > ${subMenu}` : ''}`);
  }

  /**
   * Verify current page header
   */
  static async verifyPageHeader(page: Page, expectedHeader: string) {
    const header = page.locator('.oxd-topbar-header-breadcrumb h6');
    await header.waitFor({ state: 'visible', timeout: 10000 });
    const headerText = await header.textContent();
    console.log(`📋 Current page header: ${headerText}`);
    return headerText?.includes(expectedHeader) ?? false;
  }

  /**
   * Get current breadcrumb text
   */
  static async getBreadcrumb(page: Page): Promise<string> {
    const breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
    const text = await breadcrumb.textContent() || '';
    console.log(`🧭 Breadcrumb: ${text}`);
    return text;
  }
}
