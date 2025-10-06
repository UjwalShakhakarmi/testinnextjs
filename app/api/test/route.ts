import { NextResponse } from "next/server";

interface TestResult {
  name: string;
  status?: number;
  success: boolean;
  responseTime?: string;
  headers?: { [k: string]: string };
  data?: string | null;
  error?: string;
}

export async function GET() {
  const testResults: {
    timestamp: string;
    environment: string | undefined;
    vercelUrl: string | undefined;
    tests: TestResult[];
  } = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    tests: [],
  };

  // Test 1: Basic connectivity
  try {
    const startTime = Date.now();
    const response = await fetch("https://flutter.mydynamicerp.com", {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    const endTime = Date.now();

    testResults.tests.push({
      name: "Basic connectivity to flutter.mydynamicerp.com",
      status: response.status,
      success: response.ok,
      responseTime: `${endTime - startTime}ms`,
      headers: Object.fromEntries(response.headers),
    });
  } catch (error) {
    testResults.tests.push({
      name: "Basic connectivity to flutter.mydynamicerp.com",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Test 2: API endpoint test
  try {
    const startTime = Date.now();
    const response = await fetch(
      "https://flutter.mydynamicerp.com/v1/General/GetAboutCompany",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Next.js App/Vercel Test",
        },
        signal: AbortSignal.timeout(10000),
      }
    );
    const endTime = Date.now();

    let data = null;
    let errorText = null;

    try {
      if (response.ok) {
        data = await response.json();
      } else {
        errorText = await response.text();
      }
    } catch (parseError) {
      errorText = `Parse error: ${parseError}`;
    }

    testResults.tests.push({
      name: "API endpoint test",
      status: response.status,
      success: response.ok,
      responseTime: `${endTime - startTime}ms`,
      headers: Object.fromEntries(response.headers),
      data: data ? "Data received successfully" : null,
      error: errorText || undefined,
    });
  } catch (error) {
    testResults.tests.push({
      name: "API endpoint test",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return NextResponse.json(testResults, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
