import { Page } from '@playwright/test';

/**
 * Performance Optimizer
 * Provides performance monitoring and optimization utilities
 * 
 * OrangeHRM Automation Suite
 */
export class PerformanceOptimizer {

  /**
   * Measure page load time
   */
  static async measurePageLoad(page: Page, pageName: string): Promise<number> {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ ${pageName} load time: ${loadTime}ms`);
    return loadTime;
  }

  /**
   * Measure action execution time
   */
  static async measureAction(action: () => Promise<void>, actionName: string): Promise<number> {
    const startTime = Date.now();
    await action();
    const duration = Date.now() - startTime;
    console.log(`⏱️ ${actionName} duration: ${duration}ms`);
    return duration;
  }

  /**
   * Wait for network to be idle with custom timeout
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 30000) {
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      console.log('⚠️ Network idle timeout reached, continuing...');
    }
  }

  /**
   * Optimize page by blocking unnecessary resources
   */
  static async blockUnnecessaryResources(page: Page) {
    await page.route('**/*.{png,jpg,jpeg,gif,svg,ico}', route => route.abort());
    await page.route('**/*.{woff,woff2,ttf}', route => route.abort());
    console.log('🚀 Blocked unnecessary resources for performance');
  }

  /**
   * Get page performance metrics
   */
  static async getPerformanceMetrics(page: Page) {
    const metrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        firstByte: timing.responseStart - timing.navigationStart,
      };
    });
    console.log('📊 Performance Metrics:', JSON.stringify(metrics, null, 2));
    return metrics;
  }
}
