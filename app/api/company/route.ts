import { NextResponse } from "next/server";

export async function GET() {
  try {
    const geoResponse = await fetch(
      "https://api/v1/General/GetMeritAchievers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Next.js App",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!geoResponse.ok) {
      const text = await geoResponse.text();
      console.error(
        "Upstream error fetching company:",
        geoResponse.status,
        text
      );
      return NextResponse.json(
        { error: "Upstream error", status: geoResponse.status, body: text },
        { status: 502 }
      );
    }

    const geoData = await geoResponse.json();
    return NextResponse.json(geoData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
