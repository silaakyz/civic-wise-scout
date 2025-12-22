import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuarterlyScore {
  quarter: string;
  infrastructure: number;
  environment: number;
  social: number;
  transportation: number;
}

export const useQuarterlyScores = (year: string = '2024') => {
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuarterlyScores = async () => {
      try {
        setLoading(true);
        
        // Yılın çeyreklerini belirle
        const quarters = [
          { start: `${year}-01-01`, end: `${year}-03-31`, label: `Q1 ${year}` },
          { start: `${year}-04-01`, end: `${year}-06-30`, label: `Q2 ${year}` },
          { start: `${year}-07-01`, end: `${year}-09-30`, label: `Q3 ${year}` },
          { start: `${year}-10-01`, end: `${year}-12-31`, label: `Q4 ${year}` },
        ];

        // Tüm bölgelerin ortalamasını hesapla
        const quarterlyAverages = await Promise.all(
          quarters.map(async (quarter) => {
            const { data, error } = await supabase
              .from('district_scores')
              .select('infrastructure, environment, social, transportation')
              .eq('period_start', quarter.start)
              .eq('period_end', quarter.end);

            if (error) throw error;

            if (data && data.length > 0) {
              const avg = data.reduce(
                (acc, score) => ({
                  infrastructure: acc.infrastructure + Number(score.infrastructure),
                  environment: acc.environment + Number(score.environment),
                  social: acc.social + Number(score.social),
                  transportation: acc.transportation + Number(score.transportation),
                }),
                { infrastructure: 0, environment: 0, social: 0, transportation: 0 }
              );

              return {
                quarter: quarter.label,
                infrastructure: avg.infrastructure / data.length,
                environment: avg.environment / data.length,
                social: avg.social / data.length,
                transportation: avg.transportation / data.length,
              };
            }

            return {
              quarter: quarter.label,
              infrastructure: 0,
              environment: 0,
              social: 0,
              transportation: 0,
            };
          })
        );

        setQuarterlyData(quarterlyAverages);
      } catch (err) {
        console.error('Error fetching quarterly scores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuarterlyScores();
  }, [year]);

  return { quarterlyData, loading };
};

