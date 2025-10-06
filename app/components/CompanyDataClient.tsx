"use client";

import { useState, useEffect } from "react";

interface CompanyData {
  HD_CompanyName?: string;
  Name?: string;
  HD_Slogan?: string;
  Address?: string;
  PhoneNo?: string;
  WebSite?: string;
}

// Fallback data in case API fails
const FALLBACK_DATA: CompanyData = {
  HD_CompanyName: "Dynamic Technosoft Pvt. Ltd",
  HD_Slogan: "Passion is Great",
  Address: "B & S Complex, Shankhamul Marga, Kathmandu",
  PhoneNo: "+977-51-522961",
  WebSite: "https://dynamic.net.np/contact-us",
};

export default function CompanyDataClient() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "Client: Fetching company data directly from external API..."
      );

      // Call external API directly from client instead of through our API route
      const response = await fetch(
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Client: Direct API response:", result);
      setData(result);
    } catch (err) {
      console.error(
        "Client: Direct API error, trying internal API fallback:",
        err
      );

      // Fallback to internal API route (though it's failing)
      try {
        const response = await fetch("/api/company", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Client: Internal API fallback success:", result);
          setData(result);
          return;
        }
      } catch (fallbackErr) {
        console.error(
          "Client: Internal API fallback also failed:",
          fallbackErr
        );
      }

      setError(err instanceof Error ? err.message : "Unknown error");

      // Use fallback data if both APIs fail
      console.log("Client: Using fallback data");
      setData(FALLBACK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading company information...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-state">
        <p>Failed to load data</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  const companyName =
    data.HD_CompanyName || data.Name || "Company Name Not Available";
  const isUsingFallback = error !== null;

  return (
    <div className="company-data">
      <h1>{companyName}</h1>

      {data.HD_Slogan && <p className="slogan">{data.HD_Slogan}</p>}

      {data.Address && <p className="address">{data.Address}</p>}

      {data.PhoneNo && <p className="phone">{data.PhoneNo}</p>}

      {data.WebSite && (
        <a
          href={data.WebSite}
          target="_blank"
          rel="noopener noreferrer"
          className="website"
        >
          Visit Website
        </a>
      )}

      {isUsingFallback && (
        <div className="fallback-notice">
          <small style={{ color: "#888" }}>
            ⚠️ Using cached data (API temporarily unavailable)
            <button
              onClick={handleRetry}
              style={{ marginLeft: "8px", fontSize: "12px" }}
            >
              Retry
            </button>
          </small>
        </div>
      )}

      <style jsx>{`
        .company-data {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        h1 {
          color: #333;
          margin-bottom: 10px;
        }

        .slogan {
          font-style: italic;
          color: #666;
          margin-bottom: 15px;
        }

        .address,
        .phone {
          margin: 8px 0;
          color: #555;
        }

        .website {
          display: inline-block;
          margin-top: 10px;
          color: #007bff;
          text-decoration: none;
        }

        .website:hover {
          text-decoration: underline;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-state {
          text-align: center;
          padding: 40px;
        }

        .fallback-notice {
          margin-top: 20px;
          padding: 10px;
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
        }

        button {
          padding: 4px 8px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }

        button:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}
