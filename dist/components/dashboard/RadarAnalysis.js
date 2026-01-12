import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, } from "recharts";
export const RadarAnalysis = ({ district }) => {
    const radarData = [
        { subject: "Altyapı", value: district.scores.infrastructure, fullMark: 10 },
        { subject: "Çevre", value: district.scores.environment, fullMark: 10 },
        { subject: "Sosyal", value: district.scores.social, fullMark: 10 },
        { subject: "Ulaşım", value: district.scores.transportation, fullMark: 10 },
        { subject: "Güvenlik", value: district.scores.security, fullMark: 10 },
        { subject: "Eğitim", value: district.scores.education, fullMark: 10 },
        { subject: "Sağlık", value: district.scores.health, fullMark: 10 },
    ];
    return (_jsxs("div", { className: "glass-card p-6 animate-fade-up", children: [_jsxs("h3", { className: "text-lg font-bold text-foreground mb-4", children: [district.name, " - Kriter Analizi"] }), _jsx("div", { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RadarChart, { data: radarData, children: [_jsx(PolarGrid, { stroke: "hsl(var(--border))" }), _jsx(PolarAngleAxis, { dataKey: "subject", tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 10], tick: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }), _jsx(Radar, { name: district.name, dataKey: "value", stroke: "hsl(var(--primary))", fill: "hsl(var(--primary))", fillOpacity: 0.3, strokeWidth: 2 }), _jsx(Legend, {})] }) }) })] }));
};
