import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';

class CustomReporter implements Reporter {
  private results: any[] = [];

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      errors: result.errors,
      attachment: result.attachments
    });
  }

  onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
    fs.writeFileSync('test-results.json', JSON.stringify(this.results, null, 2));
  }
}

export default CustomReporter;