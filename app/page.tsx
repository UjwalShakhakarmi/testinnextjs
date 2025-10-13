export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getKathmanduWeather() {
  try {
    const geoResponse = await fetch(
      `https://flutter.mydynamicerp.com/v1/General/GetMeritAchievers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    console.log("Response status:", geoResponse.status);

    const textResponse = await geoResponse.text(); // Get as text first
    console.log("Raw response:", textResponse);

    const geoData = JSON.parse(textResponse); // Then parse
    console.log("Parsed data:", geoData);

    return geoData;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

export default async function Home() {
  const weather = await getKathmanduWeather();

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {JSON.stringify(weather)}
    </main>
  );
}
