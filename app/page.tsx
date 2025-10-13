async function getKathmanduWeather() {
  try {
    const geoResponse = await fetch(
      `${process.env.BASE_URL}/v1/General/GetMeritAchievers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }
    );
    const geoData = await geoResponse.json();
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
