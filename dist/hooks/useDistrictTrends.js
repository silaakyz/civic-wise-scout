import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client.js';
export const useDistrictTrends = (districtId, periodType = 'quarterly') => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTrends = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('trend_data')
                    .select('period_value, overall_score')
                    .eq('district_id', districtId)
                    .eq('period_type', periodType)
                    .order('period_value');
                if (error)
                    throw error;
                setTrends(data?.map((item) => ({
                    period: item.period_value,
                    score: Number(item.overall_score),
                })) || []);
            }
            catch (err) {
                console.error('Error fetching trends:', err);
            }
            finally {
                setLoading(false);
            }
        };
        if (districtId) {
            fetchTrends();
        }
    }, [districtId, periodType]);
    return { trends, loading };
};
// Aylık veriler için özel hook
export const useMonthlyTrends = (districtIds) => {
    const [monthlyData, setMonthlyData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('trend_data')
                    .select('district_id, period_value, overall_score')
                    .in('district_id', districtIds)
                    .eq('period_type', 'monthly')
                    .like('period_value', '%2025%')
                    .order('period_value');
                if (error)
                    throw error;
                // Veriyi formatla: { month: { districtName: score } }
                const formatted = {};
                if (data) {
                    // Önce district isimlerini al
                    const { data: districts } = await supabase
                        .from('districts')
                        .select('id, name')
                        .in('id', districtIds);
                    const districtMap = new Map(districts?.map(d => [d.id, d.name]) || []);
                    data.forEach((item) => {
                        const month = item.period_value;
                        const districtName = districtMap.get(item.district_id) || '';
                        if (!formatted[month]) {
                            formatted[month] = {};
                        }
                        formatted[month][districtName] = Number(item.overall_score);
                    });
                }
                setMonthlyData(formatted);
            }
            catch (err) {
                console.error('Error fetching monthly trends:', err);
            }
            finally {
                setLoading(false);
            }
        };
        if (districtIds.length > 0) {
            fetchMonthlyData();
        }
    }, [districtIds.join(',')]);
    return { monthlyData, loading };
};
