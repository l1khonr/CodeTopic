import { NextRequest, NextResponse } from 'next/server';
import RuntimeTestCases from '@/lib/runtime-test-cases';

const runtimeTestCases = new RuntimeTestCases();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, runtime = 'node', testName } = body;

    let results;

    if (testName) {
      // Run a specific test
      const testCase = runtimeTestCases.getTestCases().find(t => t.name === testName);
      if (!testCase) {
        return NextResponse.json({ error: 'Test case not found' }, { status: 404 });
      }
      results = [await runtimeTestCases.runTest(testCase, runtime)];
    } else if (category) {
      // Run tests for a category
      results = await runtimeTestCases.runCategoryTests(category, runtime);
    } else {
      // Run all tests
      results = await runtimeTestCases.runAllTests(runtime);
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const testCases = runtimeTestCases.getTestCases();
    const categories = Array.from(new Set(testCases.map(t => t.category)));

    return NextResponse.json({
      testCases: testCases.map(t => ({ name: t.name, description: t.description, category: t.category })),
      categories
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
