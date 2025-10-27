/**
 * Runtime Test Cases for AI Agents
 *
 * This module provides a suite of test cases to validate runtime compatibility
 * for AI-generated code, particularly for WebContainer and other runtimes.
 * It covers Node.js, package managers, CLI tools, and popular frameworks.
 */
export interface TestCase {
    name: string;
    description: string;
    category: string;
    npmPackages?: string[];
    commands?: string[];
    validation?: (output: string) => boolean;
    expectedOutput?: string;
}
export interface TestResult {
    testName: string;
    success: boolean;
    output: string;
    error?: string;
    duration: number;
}
export declare class RuntimeTestCases {
    private testCases;
    /**
     * Get all test cases
     */
    getTestCases(): TestCase[];
    /**
     * Get test cases by category
     */
    getTestCasesByCategory(category: string): TestCase[];
    /**
     * Run a specific test case
     */
    runTest(testCase: TestCase, runtime?: 'webcontainer' | 'node' | 'serverless'): Promise<TestResult>;
    /**
     * Run all test cases in a category
     */
    runCategoryTests(category: string, runtime?: 'webcontainer' | 'node' | 'serverless'): Promise<TestResult[]>;
    /**
     * Run all test cases
     */
    runAllTests(runtime?: 'webcontainer' | 'node' | 'serverless'): Promise<TestResult[]>;
}
export default RuntimeTestCases;
//# sourceMappingURL=index.d.ts.map