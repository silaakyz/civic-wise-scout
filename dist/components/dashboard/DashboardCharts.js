import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.js";
import { Badge } from "../ui/badge.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select.js";
import { BarChart3, LineChart as LineChartIcon, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell, } from "recharts";
const getScoreColor = (score) => {
    if (score >= 8)
        return "#10b981";
    if (score >= 6)
        return "#22c55e";
    if (score >= 5)
        return "#f59e0b";
    if (score >= 3)
        return "#f97316";
    return "#ef4444";
};
export const DashboardCharts = ({ districts, allDistricts }) => {
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    // Prepare bar chart data
    const barChartData = districts.slice(0, 15).map((d) => ({
        name: d.name.length > 10 ? d.name.substring(0, 10) + "..." : d.name,
        fullName: d.name,
        score: d.scores.overall,
        color: getScoreColor(d.scores.overall),
    }));
    // Prepare trend data (simulated quarterly data)
    const trendData = [
        { quarter: "Q1 2024", infrastructure: 6.2, environment: 5.8, social: 6.5, transportation: 5.5 },
        { quarter: "Q2 2024", infrastructure: 6.5, environment: 6.0, social: 6.8, transportation: 5.8 },
        { quarter: "Q3 2024", infrastructure: 6.8, environment: 6.3, social: 7.0, transportation: 6.2 },
        { quarter: "Q4 2024", infrastructure: 7.0, environment: 6.5, social: 7.2, transportation: 6.5 },
    ];
    // Prepare radar data for selected or top district
    const getRadarData = (district) => [
        { category: "Altyapı", value: district.scores.infrastructure },
        { category: "Çevre", value: district.scores.environment },
        { category: "Sosyal", value: district.scores.social },
        { category: "Ulaşım", value: district.scores.transportation },
        { category: "Güvenlik", value: district.scores.security },
        { category: "Eğitim", value: district.scores.education },
        { category: "Sağlık", value: district.scores.health },
    ];
    // Area chart data for score distribution
    const distributionData = districts.map((d, i) => ({
        index: i + 1,
        name: d.name,
        score: d.scores.overall,
        average: allDistricts.reduce((sum, d) => sum + d.scores.overall, 0) / allDistricts.length,
    }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "bg-card/50 backdrop-blur-sm border-border/50", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-4 h-4 text-primary" }), "B\u00F6lge Skorlar\u0131"] }), _jsx(Badge, { variant: "outline", className: "text-xs", children: "Top 15" })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: barChartData, layout: "vertical", margin: { left: 0, right: 20 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))", opacity: 0.3 }), _jsx(XAxis, { type: "number", domain: [0, 10], tick: { fontSize: 10 } }), _jsx(YAxis, { dataKey: "name", type: "category", width: 70, tick: { fontSize: 10 } }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: "hsl(var(--card))",
                                                        border: "1px solid hsl(var(--border))",
                                                        borderRadius: "8px",
                                                        fontSize: "12px",
                                                    }, formatter: (value) => [value.toFixed(2), "Skor"], labelFormatter: (label) => {
                                                        const item = barChartData.find((d) => d.name === label);
                                                        return item?.fullName || label;
                                                    } }), _jsx(Bar, { dataKey: "score", radius: [0, 4, 4, 0], children: barChartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) })] }) }) }) })] }), _jsxs(Card, { className: "bg-card/50 backdrop-blur-sm border-border/50", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [_jsx(LineChartIcon, { className: "w-4 h-4 text-primary" }), "Performans Trendi"] }), _jsx(Badge, { variant: "outline", className: "text-xs", children: "2024" })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: trendData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))", opacity: 0.3 }), _jsx(XAxis, { dataKey: "quarter", tick: { fontSize: 10 } }), _jsx(YAxis, { domain: [4, 8], tick: { fontSize: 10 } }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: "hsl(var(--card))",
                                                        border: "1px solid hsl(var(--border))",
                                                        borderRadius: "8px",
                                                        fontSize: "12px",
                                                    } }), _jsx(Legend, { iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: "10px" } }), _jsx(Line, { type: "monotone", dataKey: "infrastructure", name: "Altyap\u0131", stroke: "#3b82f6", strokeWidth: 2, dot: { r: 3 } }), _jsx(Line, { type: "monotone", dataKey: "environment", name: "\u00C7evre", stroke: "#10b981", strokeWidth: 2, dot: { r: 3 } }), _jsx(Line, { type: "monotone", dataKey: "social", name: "Sosyal", stroke: "#8b5cf6", strokeWidth: 2, dot: { r: 3 } }), _jsx(Line, { type: "monotone", dataKey: "transportation", name: "Ula\u015F\u0131m", stroke: "#f59e0b", strokeWidth: 2, dot: { r: 3 } })] }) }) }) })] })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [_jsx(Activity, { className: "w-4 h-4 text-primary" }), "Skor Da\u011F\u0131l\u0131m\u0131"] }), _jsx(Badge, { variant: "outline", className: "text-xs", children: "T\u00FCm B\u00F6lgeler" })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: distributionData, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "scoreGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#3b82f6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#3b82f6", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "avgGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#f59e0b", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#f59e0b", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))", opacity: 0.3 }), _jsx(XAxis, { dataKey: "index", tick: { fontSize: 10 } }), _jsx(YAxis, { domain: [0, 10], tick: { fontSize: 10 } }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: "hsl(var(--card))",
                                                        border: "1px solid hsl(var(--border))",
                                                        borderRadius: "8px",
                                                        fontSize: "12px",
                                                    }, labelFormatter: (label) => {
                                                        const item = distributionData.find((d) => d.index === label);
                                                        return item?.name || `Bölge ${label}`;
                                                    } }), _jsx(Legend, { iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: "10px" } }), _jsx(Area, { type: "monotone", dataKey: "score", name: "Skor", stroke: "#3b82f6", fill: "url(#scoreGradient)", strokeWidth: 2 }), _jsx(Area, { type: "monotone", dataKey: "average", name: "Ortalama", stroke: "#f59e0b", fill: "url(#avgGradient)", strokeWidth: 2, strokeDasharray: "5 5" })] }) }) }) })] }), _jsxs(Card, { className: "bg-card/50 backdrop-blur-sm border-border/50", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx(CardTitle, { className: "text-sm font-semibold", children: "Kategori Analizi" }) }), _jsxs(Select, { value: selectedDistrict?.id?.toString() || allDistricts[0]?.id?.toString(), onValueChange: (value) => {
                                            const district = allDistricts.find((d) => d.id.toString() === value);
                                            setSelectedDistrict(district || null);
                                        }, children: [_jsx(SelectTrigger, { className: "w-full h-8 text-xs", children: _jsx(SelectValue, { placeholder: "\u0130l\u00E7e se\u00E7in" }) }), _jsx(SelectContent, { className: "max-h-64 bg-popover z-50", children: allDistricts.map((district) => (_jsx(SelectItem, { value: district.id.toString(), className: "text-xs", children: district.name }, district.id))) })] })] }), _jsx(CardContent, { children: _jsxs(Tabs, { defaultValue: "radar", className: "w-full", children: [_jsxs(TabsList, { className: "w-full mb-2", children: [_jsx(TabsTrigger, { value: "radar", className: "flex-1 text-xs", children: "Radar" }), _jsx(TabsTrigger, { value: "list", className: "flex-1 text-xs", children: "Liste" })] }), _jsx(TabsContent, { value: "radar", children: _jsx("div", { className: "h-52", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RadarChart, { data: getRadarData(selectedDistrict || districts[0]), children: [_jsx(PolarGrid, { stroke: "hsl(var(--border))" }), _jsx(PolarAngleAxis, { dataKey: "category", tick: { fontSize: 9 } }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 10], tick: { fontSize: 8 } }), _jsx(Radar, { name: "Skor", dataKey: "value", stroke: "#3b82f6", fill: "#3b82f6", fillOpacity: 0.3 })] }) }) }) }), _jsx(TabsContent, { value: "list", children: _jsx("div", { className: "space-y-2 h-52 overflow-y-auto", children: getRadarData(selectedDistrict || districts[0]).map((item) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-muted/30 rounded-lg", children: [_jsx("span", { className: "text-xs", children: item.category }), _jsx(Badge, { variant: item.value >= 7 ? "default" : item.value >= 5 ? "secondary" : "destructive", className: "text-xs", children: item.value.toFixed(1) })] }, item.category))) }) })] }) })] })] })] }));
};
