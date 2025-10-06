import { Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import CompanyDataClient from "./components/CompanyDataClient";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Server Component for initial data fetch
async function ServerCompanyData() {
  try {
    const data = await fetchData();
    const { HD_CompanyName, Name, HD_Slogan, Address, PhoneNo, WebSite } =
      data || {};
    const companyName = HD_CompanyName || Name || "No company name found";

    console.log("Server: Fetched data successfully:", data);

    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ color: "#333", marginBottom: "10px" }}>{companyName}</h1>
        {HD_Slogan && (
          <p
            style={{ fontStyle: "italic", color: "#666", marginBottom: "15px" }}
          >
            {HD_Slogan}
          </p>
        )}
        {Address && <p style={{ margin: "8px 0", color: "#555" }}>{Address}</p>}
        {PhoneNo && <p style={{ margin: "8px 0", color: "#555" }}>{PhoneNo}</p>}
        {WebSite && (
          <a
            href={WebSite}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "10px",
              color: "#007bff",
              textDecoration: "none",
            }}
          >
            Visit Website
          </a>
        )}
      </div>
    );
  } catch (error) {
    console.error(
      "Server: Error fetching data, falling back to client:",
      error
    );
    // Throw error to trigger Suspense fallback
    throw error;
  }
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <ErrorBoundary
        fallback={
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <h2>Loading company information...</h2>
            <p>
              If this takes too long, we&apos;ll switch to client-side loading.
            </p>
            {/* Fallback to client-side component */}
            <Suspense fallback={<LoadingSpinner />}>
              <CompanyDataClient />
            </Suspense>
          </div>
        }
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ServerCompanyData />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

const fetchData = async (retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(
        `Starting API call (attempt ${attempt + 1}/${
          retries + 1
        }) to internal API route...`
      );

      // Build the full URL for server-side rendering
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "";

      const apiUrl = baseUrl ? `${baseUrl}/api/company` : "/api/company";

      // Use GET method since that's what the API route handles
      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
      });

      console.log("API response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const data = await res.json();
      console.log("API response data:", data);
      return data;
    } catch (error) {
      console.error(`Fetch error on attempt ${attempt + 1}:`, {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        cause: error instanceof Error ? error.cause : undefined,
      });

      // If it's the last attempt, throw
      if (attempt === retries) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};
