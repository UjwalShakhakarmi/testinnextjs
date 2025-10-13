import { NextResponse } from "next/server";

export async function GET() {
  console.log("=== API Route Called ===");
  console.log("BASE_URL:", process.env.BASE_URL);

  try {
    const url = `${process.env.BASE_URL}/v1/General/GetMeritAchievers`;
    console.log("Fetching from:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { error: `HTTP ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Success! Data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error: error.name,
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
