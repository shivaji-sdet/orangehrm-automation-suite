import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

/**
 * Custom Progress Reporter
 * Provides detailed test execution progress in console
 * 
 * OrangeHRM Automation Suite
 */
class ProgressReporter implements Reporter {
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;
  private startTime = 0;

  onBegin(config: FullConfig, suite: Suite) {
    this.totalTests = suite.allTests().length;
    this.startTime = Date.now();
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🚀 OrangeHRM Automation Suite - Test Execution');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  📋 Total Tests: ${this.totalTests}`);
    console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'staging'}`);
    console.log(`  ⏰ Started at: ${new Date().toLocaleTimeString()}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
  }

  onTestBegin(test: TestCase) {
    const currentTest = this.passedTests + this.failedTests + this.skippedTests + 1;
    console.log(`  [${currentTest}/${this.totalTests}] ▶️  ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const duration = (result.duration / 1000).toFixed(1);

    switch (result.status) {
      case 'passed':
        this.passedTests++;
        console.log(`  [${this.getProgress()}] ✅ PASSED: ${test.title} (${duration}s)`);
        break;
      case 'failed':
        this.failedTests++;
        console.log(`  [${this.getProgress()}] ❌ FAILED: ${test.title} (${duration}s)`);
        if (result.error) {
          console.log(`           Error: ${result.error.message?.substring(0, 200)}`);
        }
        break;
      case 'skipped':
        this.skippedTests++;
        console.log(`  [${this.getProgress()}] ⏭️  SKIPPED: ${test.title}`);
        break;
      case 'timedOut':
        this.failedTests++;
        console.log(`  [${this.getProgress()}] ⏰ TIMEOUT: ${test.title} (${duration}s)`);
        break;
    }
  }

  onEnd(result: FullResult) {
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const passRate = this.totalTests > 0 ? ((this.passedTests / this.totalTests) * 100).toFixed(1) : '0';

    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  📊 Test Execution Summary');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  ✅ Passed:  ${this.passedTests}`);
    console.log(`  ❌ Failed:  ${this.failedTests}`);
    console.log(`  ⏭️  Skipped: ${this.skippedTests}`);
    console.log(`  📋 Total:   ${this.totalTests}`);
    console.log(`  📈 Pass Rate: ${passRate}%`);
    console.log(`  ⏱️  Duration: ${totalDuration}s`);
    console.log(`  🏁 Status: ${result.status.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
  }

  private getProgress(): string {
    const current = this.passedTests + this.failedTests + this.skippedTests;
    return `${current}/${this.totalTests}`;
  }
}

export default ProgressReporter;
