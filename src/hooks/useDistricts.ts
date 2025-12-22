import { useEffect, useState } from "react";
import { District } from "@/data/districtData";

export const useDistricts = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 8000);

    const fetchDistricts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:4000/api/districts-full", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("District verileri alınamadı");
        }

        const data = await res.json();

        setDistricts(data);
      } catch (err: any) {
        console.error("[useDistricts] Backend error:", err);
        setError("Veriler yüklenirken hata oluştu");
        setDistricts([]);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchDistricts();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return { districts, loading, error };
};

