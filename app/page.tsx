import { Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import CompanyDataClient from "./components/CompanyDataClient";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
            <p>Please wait while we fetch the latest data...</p>
          </div>
        }
      >
        <Suspense fallback={<LoadingSpinner />}>
          <CompanyDataClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
