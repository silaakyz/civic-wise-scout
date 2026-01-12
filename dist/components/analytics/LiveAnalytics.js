import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
export const LiveAnalytics = ({ districts: propDistricts }) => {
    const mainChartRef = useRef(null);
    const yearChartRef = useRef(null);
    useEffect(() => {
        // Wrapper logic for existing script
        const districts = [
            { id: 1, name: "Konak", scores: { overall: 8 } },
            { id: 2, name: "Karşıyaka", scores: { overall: 6 } },
            { id: 3, name: "Bornova", scores: { overall: 6 } },
            { id: 4, name: "Buca", scores: { overall: 6 } },
            { id: 5, name: "Bayraklı", scores: { overall: 7 } },
            { id: 6, name: "Çiğli", scores: { overall: 6 } }
        ];
        const viewModeSelect = document.getElementById('viewModeSelect');
        const yearSelect = document.getElementById('yearSelect');
        const districtSelect = document.getElementById('districtSelect');
        const mainChartTitle = document.getElementById('mainChartTitle');
        const summaryContainer = document.getElementById('summaryContainer');
        const mainChartCanvas = document.getElementById('mainChart').getContext('2d');
        const yearChartCanvas = document.getElementById('yearComparisonChart').getContext('2d');
        const colors = ['#006064', '#00838f', '#0097a7', '#00acc1', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa'];
        // Access Chart from window
        const Chart = window.Chart;
        function generateMonthlyData(selectedDistricts) {
            const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
            return months.map((month, index) => {
                const obj = { month };
                selectedDistricts.forEach(d => {
                    const variation = Math.sin((index / 12) * Math.PI * 2) * 0.5 + (Math.random() - 0.5) * 0.3;
                    obj[d.name] = Math.min(10, Math.max(1, d.scores.overall + variation));
                });
                return obj;
            });
        }
        function generateQuarterlyData(selectedDistricts, year) {
            const quarters = [`Q1 ${year}`, `Q2 ${year}`, `Q3 ${year}`, `Q4 ${year}`];
            return quarters.map((q, index) => {
                const obj = { quarter: q };
                selectedDistricts.forEach(d => {
                    const yearOffset = year === '2023' ? -0.6 : year === '2024' ? -0.3 : 0;
                    const trend = index * 0.15;
                    const variation = (Math.random() - 0.5) * 0.4;
                    obj[d.name] = Math.min(10, Math.max(1, d.scores.overall + yearOffset + trend + variation));
                });
                return obj;
            });
        }
        function generateYearComparison(selectedDistricts) {
            return selectedDistricts.map(d => {
                const score2023 = Math.min(10, Math.max(1, d.scores.overall - 0.8 + (Math.random() - 0.5) * 0.4));
                const score2024 = Math.min(10, Math.max(1, d.scores.overall - 0.3 + (Math.random() - 0.5) * 0.3));
                const score2025 = d.scores.overall;
                return { name: d.name, "2023": score2023, "2024": score2024, "2025": score2025 };
            });
        }
        function updateDashboard() {
            if (!viewModeSelect || !yearSelect || !districtSelect)
                return;
            const viewMode = viewModeSelect.value;
            const year = yearSelect.value;
            const districtOption = districtSelect.value;
            let selectedDistricts = districtOption === 'all' ? districts : districts.slice(0, 5);
            const monthlyData = generateMonthlyData(selectedDistricts);
            const quarterlyData = generateQuarterlyData(selectedDistricts, year);
            const yearComparison = generateYearComparison(selectedDistricts);
            if (mainChartTitle)
                mainChartTitle.innerText = viewMode === 'monthly' ? "Aylık Trend Analizi (2025)" : `Çeyreklik Performans (${year})`;
            yearSelect.style.display = viewMode === 'quarterly' ? 'inline' : 'none';
            // Summary Stats
            if (summaryContainer) {
                summaryContainer.innerHTML = '';
                const avg2025 = yearComparison.reduce((sum, d) => sum + d["2025"], 0) / yearComparison.length;
                const avg2024 = yearComparison.reduce((sum, d) => sum + d["2024"], 0) / yearComparison.length;
                const avg2023 = yearComparison.reduce((sum, d) => sum + d["2023"], 0) / yearComparison.length;
                const yoyChange = ((avg2025 - avg2024) / avg2024 * 100).toFixed(1);
                const stats = [
                    { label: "2025 Ortalaması", value: avg2025.toFixed(1) },
                    { label: "2024 Ortalaması", value: avg2024.toFixed(1) },
                    { label: "2023 Ortalaması", value: avg2023.toFixed(1) },
                    { label: "Yıllık Değişim", value: yoyChange + "%" },
                    { label: "İzlenen Bölge", value: selectedDistricts.length }
                ];
                stats.forEach(s => {
                    const div = document.createElement('div');
                    div.className = 'glass-card p-2 text-center';
                    div.innerHTML = `<strong>${s.label}</strong><p>${s.value}</p>`;
                    summaryContainer.appendChild(div);
                });
            }
            // Main Chart
            if (mainChartRef.current)
                mainChartRef.current.destroy();
            if (viewMode === 'monthly') {
                mainChartRef.current = new Chart(mainChartCanvas, {
                    type: 'line',
                    data: {
                        labels: monthlyData.map(d => d.month),
                        datasets: selectedDistricts.map((d, index) => ({
                            label: d.name,
                            data: monthlyData.map(m => m[d.name]),
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length] + '33',
                            fill: true,
                            tension: 0.4
                        }))
                    },
                    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
                });
            }
            else {
                mainChartRef.current = new Chart(mainChartCanvas, {
                    type: 'bar',
                    data: {
                        labels: quarterlyData.map(d => d.quarter),
                        datasets: selectedDistricts.map((d, index) => ({
                            label: d.name,
                            data: quarterlyData.map(q => q[d.name]),
                            backgroundColor: colors[index % colors.length]
                        }))
                    },
                    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
                });
            }
            // Year comparison chart
            if (yearChartRef.current)
                yearChartRef.current.destroy();
            yearChartRef.current = new Chart(yearChartCanvas, {
                type: 'bar',
                data: {
                    labels: yearComparison.map(d => d.name),
                    datasets: [
                        { label: "2023", data: yearComparison.map(d => d["2023"]), backgroundColor: colors[0] },
                        { label: "2024", data: yearComparison.map(d => d["2024"]), backgroundColor: colors[1] },
                        { label: "2025", data: yearComparison.map(d => d["2025"]), backgroundColor: colors[2] }
                    ]
                },
                options: { indexAxis: 'y', responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }
        viewModeSelect?.addEventListener('change', updateDashboard);
        yearSelect?.addEventListener('change', updateDashboard);
        districtSelect?.addEventListener('change', updateDashboard);
        // Initial paint timeout to ensure chart loaded
        setTimeout(updateDashboard, 500);
        return () => {
            viewModeSelect?.removeEventListener('change', updateDashboard);
            yearSelect?.removeEventListener('change', updateDashboard);
            districtSelect?.removeEventListener('change', updateDashboard);
            if (mainChartRef.current)
                mainChartRef.current.destroy();
            if (yearChartRef.current)
                yearChartRef.current.destroy();
        };
    }, []);
    return (_jsxs("div", { style: { fontFamily: 'sans-serif', margin: '20px', color: '#333' }, children: [_jsxs("div", { className: "glass-card", style: { background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(200,200,200,0.4)', padding: '20px', marginBottom: '20px' }, children: [_jsx("h2", { className: "font-bold", style: { fontWeight: 'bold' }, children: "Veri Analizi" }), _jsx("p", { className: "text-muted", style: { color: '#666' }, children: "Ayl\u0131k trendler ve y\u0131ll\u0131k kar\u015F\u0131la\u015Ft\u0131rmalar (2023-2025)" }), _jsxs("div", { className: "flex gap-3 flex-wrap", style: { marginTop: '12px', display: 'flex', gap: '12px' }, children: [_jsxs("select", { id: "viewModeSelect", style: { padding: '4px 6px', borderRadius: '6px', border: '1px solid #ccc' }, children: [_jsx("option", { value: "monthly", children: "Ayl\u0131k G\u00F6r\u00FCn\u00FCm" }), _jsx("option", { value: "quarterly", children: "\u00C7eyreklik G\u00F6r\u00FCn\u00FCm" })] }), _jsxs("select", { id: "yearSelect", style: { display: 'none', padding: '4px 6px', borderRadius: '6px', border: '1px solid #ccc' }, children: [_jsx("option", { value: "2023", children: "2023" }), _jsx("option", { value: "2024", children: "2024" }), _jsx("option", { value: "2025", defaultValue: "2025", children: "2025" })] }), _jsxs("select", { id: "districtSelect", style: { padding: '4px 6px', borderRadius: '6px', border: '1px solid #ccc' }, children: [_jsx("option", { value: "all", children: "T\u00FCm B\u00F6lgeler" }), _jsx("option", { value: "top5", defaultValue: "top5", children: "\u0130lk 5 B\u00F6lge" })] })] })] }), _jsxs("div", { className: "glass-card", id: "summaryStats", style: { background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(200,200,200,0.4)', padding: '20px', marginBottom: '20px' }, children: [_jsx("h3", { className: "font-bold", style: { fontWeight: 'bold' }, children: "\u00D6zet \u0130statistikler" }), _jsx("div", { className: "grid grid-cols-5 gap-4", id: "summaryContainer", style: { display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(5, 1fr)' } })] }), _jsxs("div", { className: "glass-card", style: { background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(200,200,200,0.4)', padding: '20px', marginBottom: '20px' }, children: [_jsx("h3", { className: "font-bold", id: "mainChartTitle", style: { fontWeight: 'bold' }, children: "Ayl\u0131k Trend Analizi (2025)" }), _jsx("canvas", { id: "mainChart", height: "300", style: { maxWidth: '100%' } })] }), _jsxs("div", { className: "glass-card", style: { background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(200,200,200,0.4)', padding: '20px', marginBottom: '20px' }, children: [_jsx("h3", { className: "font-bold", style: { fontWeight: 'bold' }, children: "2023 - 2024 - 2025 Kar\u015F\u0131la\u015Ft\u0131rmas\u0131" }), _jsx("canvas", { id: "yearComparisonChart", height: "400", style: { maxWidth: '100%' } })] })] }));
};
