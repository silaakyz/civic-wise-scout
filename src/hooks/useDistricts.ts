import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { District } from '@/lib/district';

export const useDistricts = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      const start = Date.now();
      const timeoutMs = 8000; // fall back to mock data after 8s
      let timeoutId: NodeJS.Timeout | null = null;

      try {
        console.log('[useDistricts] Starting fetchDistricts');
        setLoading(true);
        setError(null);

        // Safety timeout so UI doesn't stay stuck
        timeoutId = setTimeout(() => {
          console.warn(`[useDistricts] Fetching districts timed out after ${timeoutMs}ms — falling back to empty list`);
          setDistricts([]); // falling back to an empty list when fetch times out
          setError('Timeout while fetching districts');
          setLoading(false);
        }, timeoutMs);

        // En son skorları almak için Q1 2025 verilerini çek
        const currentPeriodStart = '2025-01-01';
        const currentPeriodEnd = '2025-03-31';

        // Tüm bölgeleri çek
        const { data: districtsData, error: districtsError } = await supabase
          .from('districts')
          .select('*')
          .order('id');

        if (districtsError) throw districtsError;
        if (!districtsData) return;

        console.log(`[useDistricts] Received ${districtsData.length} districts, fetching details... (elapsed ${Date.now() - start}ms)`);

        // Her bölge için skorları, negatif faktörleri, trend verilerini ve aksiyonları çek
        const districtsWithData = await Promise.all(
          districtsData.map(async (district) => {
            // Skorları çek
            const { data: scoresData } = await supabase
              .from('district_scores')
              .select('*')
              .eq('district_id', district.id)
              .eq('period_start', currentPeriodStart)
              .eq('period_end', currentPeriodEnd)
              .limit(1);

            // Negatif faktörleri çek
            const { data: factorsData } = await supabase
              .from('negative_factors')
              .select('*')
              .eq('district_id', district.id)
              .eq('period_start', currentPeriodStart)
              .eq('period_end', currentPeriodEnd)
              .limit(1);

            // Trend verilerini çek (çeyreklik)
            const { data: trendData } = await supabase
              .from('trend_data')
              .select('overall_score')
              .eq('district_id', district.id)
              .eq('period_type', 'quarterly')
              .order('period_value')
              .limit(4);

            // Önerilen aksiyonları çek
            const { data: actionsData } = await supabase
              .from('recommended_actions')
              .select('*')
              .eq('district_id', district.id)
              .order('priority', { ascending: false });

            // Veriyi District formatına dönüştür
            const districtFormatted: District = {
              id: district.id,
              name: district.name,
              coordinates: [district.latitude, district.longitude],
              radius: district.radius,
              scores: scoresData && scoresData.length > 0
                ? {
                    infrastructure: Number(scoresData[0].infrastructure),
                    environment: Number(scoresData[0].environment),
                    social: Number(scoresData[0].social),
                    transportation: Number(scoresData[0].transportation),
                    security: Number(scoresData[0].security),
                    education: Number(scoresData[0].education),
                    health: Number(scoresData[0].health),
                    overall: Number(scoresData[0].overall),
                  }
                : {
                    infrastructure: 0,
                    environment: 0,
                    social: 0,
                    transportation: 0,
                    security: 0,
                    education: 0,
                    health: 0,
                    overall: 0,
                  },
              negativeFactors: factorsData && factorsData.length > 0
                ? {
                    uncontrolledMigration: Number(factorsData[0].uncontrolled_migration),
                    informalSettlement: Number(factorsData[0].informal_settlement),
                    crimeRate: Number(factorsData[0].crime_rate),
                    trafficCongestion: Number(factorsData[0].traffic_congestion),
                    noisePollution: Number(factorsData[0].noise_pollution),
                  }
                : {
                    uncontrolledMigration: 0,
                    informalSettlement: 0,
                    crimeRate: 0,
                    trafficCongestion: 0,
                    noisePollution: 0,
                  },
              trendData: trendData && trendData.length > 0
                ? trendData.map((t) => Number(t.overall_score))
                : [0, 0, 0, 0],
              recommendedActions: actionsData
                ? actionsData.map((action) => ({
                    action: action.action,
                    potentialScore: Number(action.potential_score),
                    priority: action.priority,
                    budget: action.budget || '',
                  }))
                : [],
            };

            return districtFormatted;
          })
        );

        console.log(`[useDistricts] Finished fetching district details (elapsed ${Date.now() - start}ms)`);

        setDistricts(districtsWithData);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError(err instanceof Error ? err.message : 'Veriler yüklenirken bir hata oluştu');
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  return { districts, loading, error };
};
