import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("API route: Starting API call to flutter.mydynamicerp.com...");
    console.log("API route: Environment:", process.env.NODE_ENV);
    console.log("API route: Vercel URL:", process.env.VERCEL_URL);

    const res = await fetch(
      "https://flutter.mydynamicerp.com/v1/General/GetAboutCompany",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; Next.js/14.0; +https://nextjs.org)",
          "Referer": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10000), // Increased timeout for production
      }
    );

    console.log("API route: Response status:", res.status);
    console.log("API route: Response headers:", Object.fromEntries(res.headers));

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API route: Error response:", errorText);
      return NextResponse.json(
        { error: `HTTP error! status: ${res.status}, message: ${errorText}` },
        { 
          status: res.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const data = await res.json();
    console.log("API route: Success, returning data");

    // Add CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("API route: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
