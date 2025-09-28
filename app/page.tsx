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
  const res = await fetch(
    "https://flutter.mydynamicerp.com/v1/General/GetAboutCompany",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};
