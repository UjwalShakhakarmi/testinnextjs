// Force dynamic rendering for this page

export default async function Home() {
  try {
    const data = await fetchData();
    const { Name } = data || {};
    console.log("Fetched data:", data);
    return <div className="sds">{Name || "Loading..."}</div>;
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div className="sds">Error loading data</div>;
  }
}

const fetchData = async () => {
  try {
    console.log("Starting API call to flutter.mydynamicerp.com...");

    const res = await fetch(
      "https://flutter.mydynamicerp.com/v1/General/GetAboutCompany",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Add timeout for Vercel
      }
    );

    console.log("API response status:", res.status);
    console.log("API response headers:", Object.fromEntries(res.headers));

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error response:", errorText);
      throw new Error(
        `HTTP error! status: ${res.status}, message: ${errorText}`
      );
    }

    const data = await res.json();
    console.log("API response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      cause: error instanceof Error ? error.cause : undefined,
    });
    throw error;
  }
};
