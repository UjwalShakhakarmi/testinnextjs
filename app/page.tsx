export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getKathmanduWeather() {
  console.log("=== Fetching from API route ===");

  try {
    // Fetch from your own API route
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/merit`,
      {
        cache: "no-store",
      }
    );

    console.log("API route response status:", response.status);

    if (!response.ok) {
      console.error("API route failed:", response.status);
      const errorData = await response.json();
      console.error("Error data:", errorData);
      return errorData;
    }

    const data = await response.json();
    console.log("Data received:", data);
    return data;
  } catch (error) {
    console.error("Error calling API route:", error);
    return { error: error.message };
  }
}

export default async function Home() {
  const weather = await getKathmanduWeather();

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">API Response</h1>

        {weather === null ? (
          <div className="text-red-500">
            <p className="font-bold">Result is NULL</p>
          </div>
        ) : weather?.error ? (
          <div className="text-red-500">
            <p className="font-bold">Error: {weather.error}</p>
            <pre className="mt-2 bg-red-50 p-4 rounded text-sm">
              {JSON.stringify(weather, null, 2)}
            </pre>
          </div>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm text-black">
            {JSON.stringify(weather, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
