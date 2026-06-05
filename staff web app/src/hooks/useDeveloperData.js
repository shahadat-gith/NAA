import { useState, useEffect } from "react";

// Replace this with the RAW URL you copied in Step 1
const GIST_RAW_URL = "https://gist.githubusercontent.com/shahadat-gith/712d93d6d4be21791ff4c6aacc75eb35/raw/shahadat.json";

export const useDeveloperData = () => {
  const [developerInfo, setDeveloperInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDeveloperData = async () => {
      try {
        setLoading(true);
        const response = await fetch(GIST_RAW_URL);
        
        if (!response.ok) {
          throw new Error("Network response handshake failed.");
        }
        
        const json = await response.json();
        setDeveloperInfo(json);
        setError(false);
      } catch (err) {
        console.error("[Gist Engine Error]: Failed to fetch global profile metrics:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, []);

  return { developerInfo, loading, error };
};