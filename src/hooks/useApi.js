import { useEffect, useState } from "react";
import { apiRequest } from "../api/nexusApi";

export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) {
      return;
    }
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest(path);
        if (active) {
          setData(response);
        }
      } catch (err) {
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [path]);

  return {
    data,
    loading,
    error,
  };
}
