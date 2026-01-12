import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { criteriaWeights } from "../../lib/district.js";
import { Slider } from "../ui/slider.js";
import { Button } from "../ui/button.js";
import { Badge } from "../ui/badge.js";
import { Card } from "../ui/card.js";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import { PlayCircle, TrendingUp, TrendingDown, Minus, Filter, BarChart3, PieChart, Table2, Download, Maximize2, RefreshCw, } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPie, Pie, Legend, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, } from "recharts";
export const ScenarioAnalysis = ({ districts }) => {
    const [weights, setWeights] = useState({
        infrastructure: 15,
        environment: 12,
        social: 13,
        transportation: 15,
        security: 15,
        education: 15,
        health: 15,
    });
    const [scenarioResults, setScenarioResults] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState("all");
    const [viewMode, setViewMode] = useState("chart");
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const calculateScenarioScore = (district) => {
        const normalizedWeights = Object.fromEntries(Object.entries(weights).map(([key, val]) => [key, val / totalWeight]));
        const score = district.scores.infrastructure * normalizedWeights.infrastructure +
            district.scores.environment * normalizedWeights.environment +
            district.scores.social * normalizedWeights.social +
            district.scores.transportation * normalizedWeights.transportation +
            district.scores.security * normalizedWeights.security +
            district.scores.education * normalizedWeights.education +
            district.scores.health * normalizedWeights.health;
        return score;
    };
    const runScenario = () => {
        const results = districts.map((d) => {
            const scenarioScore = calculateScenarioScore(d);
            const change = scenarioScore - d.scores.overall;
            return {
                name: d.name,
                original: d.scores.overall,
                scenario: scenarioScore,
                change,
                changePercent: (change / d.scores.overall) * 100,
            };
        });
        setScenarioResults(results.sort((a, b) => b.scenario - a.scenario));
    };
    const resetWeights = () => {
        setWeights({
            infrastructure: 15,
            environment: 12,
            social: 13,
            transportation: 15,
            security: 15,
            education: 15,
            health: 15,
        });
        setScenarioResults(null);
    };
    const filteredResults = useMemo(() => {
        if (!scenarioResults)
            return null;
        if (selectedDistrict === "all")
            return scenarioResults;
        return scenarioResults.filter((r) => r.name === selectedDistrict);
    }, [scenarioResults, selectedDistrict]);
    const summaryStats = useMemo(() => {
        if (!scenarioResults)
            return null;
        const avgOriginal = scenarioResults.reduce((a, b) => a + b.original, 0) / scenarioResults.length;
        const avgScenario = scenarioResults.reduce((a, b) => a + b.scenario, 0) / scenarioResults.length;
        const maxGain = Math.max(...scenarioResults.map((r) => r.change));
        const maxLoss = Math.min(...scenarioResults.map((r) => r.change));
        const improved = scenarioResults.filter((r) => r.change > 0).length;
        const declined = scenarioResults.filter((r) => r.change < 0).length;
        return {
            avgOriginal,
            avgScenario,
            avgChange: avgScenario - avgOriginal,
            maxGain,
            maxLoss,
            improved,
            declined,
            unchanged: scenarioResults.length - improved - declined,
        };
    }, [scenarioResults]);
    const pieData = useMemo(() => {
        if (!summaryStats)
            return [];
        return [
            { name: "Artan", value: summaryStats.improved, fill: "hsl(142, 71%, 45%)" },
            { name: "Azalan", value: summaryStats.declined, fill: "hsl(0, 72%, 51%)" },
            { name: "Sabit", value: summaryStats.unchanged, fill: "hsl(220, 14%, 50%)" },
        ];
    }, [summaryStats]);
    const weightDistributionData = useMemo(() => {
        return Object.entries(criteriaWeights).map(([key, config]) => ({
            name: config.name,
            value: weights[key],
            fullMark: 30,
        }));
    }, [weights]);
    const getChangeColor = (change) => {
        if (change > 0.3)
            return "text-emerald-500";
        if (change > 0)
            return "text-green-400";
        if (change > -0.3)
            return "text-amber-500";
        return "text-red-500";
    };
    const getBarColor = (change) => {
        if (change > 0.3)
            return "hsl(142, 71%, 45%)";
        if (change > 0)
            return "hsl(142, 71%, 55%)";
        if (change > -0.3)
            return "hsl(45, 100%, 50%)";
        return "hsl(0, 72%, 51%)";
    };
    const ChangeIcon = ({ change }) => {
        if (change > 0)
            return _jsx(TrendingUp, { className: "w-4 h-4" });
        if (change < 0)
            return _jsx(TrendingDown, { className: "w-4 h-4" });
        return _jsx(Minus, { className: "w-4 h-4" });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Senaryo Analizi" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Kriter a\u011F\u0131rl\u0131klar\u0131n\u0131 de\u011Fi\u015Ftirerek b\u00F6lge performanslar\u0131n\u0131 sim\u00FCle edin" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", onClick: resetWeights, children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "S\u0131f\u0131rla"] }), _jsxs(Button, { size: "sm", className: "gap-2", onClick: runScenario, children: [_jsx(PlayCircle, { className: "w-4 h-4" }), "\u00C7al\u0131\u015Ft\u0131r"] })] })] }), scenarioResults && summaryStats && (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-up", children: [_jsxs(Card, { className: "p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-primary", children: [_jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Ort. Orijinal" }), _jsx("p", { className: "text-2xl font-bold mt-1", children: summaryStats.avgOriginal.toFixed(2) })] }), _jsxs(Card, { className: "p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-blue-500", children: [_jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Ort. Senaryo" }), _jsx("p", { className: "text-2xl font-bold mt-1", children: summaryStats.avgScenario.toFixed(2) })] }), _jsxs(Card, { className: "p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-emerald-500", children: [_jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Artan B\u00F6lge" }), _jsx("p", { className: "text-2xl font-bold mt-1 text-emerald-500", children: summaryStats.improved })] }), _jsxs(Card, { className: "p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-red-500", children: [_jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Azalan B\u00F6lge" }), _jsx("p", { className: "text-2xl font-bold mt-1 text-red-500", children: summaryStats.declined })] }), _jsxs(Card, { className: "p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-green-400", children: [_jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Max Art\u0131\u015F" }), _jsxs("p", { className: "text-2xl font-bold mt-1 text-green-400", children: ["+", summaryStats.maxGain.toFixed(2)] })] }), _jsxs(Card, { className: "p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-amber-500", children: [_jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Max D\u00FC\u015F\u00FC\u015F" }), _jsx("p", { className: "text-2xl font-bold mt-1 text-amber-500", children: summaryStats.maxLoss.toFixed(2) })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4", children: [_jsxs("div", { className: "lg:col-span-3 space-y-4", children: [_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "w-4 h-4 text-primary" }), _jsx("h3", { className: "font-semibold text-sm", children: "Kriter A\u011F\u0131rl\u0131klar\u0131" })] }), _jsxs(Badge, { variant: totalWeight === 100 ? "secondary" : "destructive", className: "text-xs", children: ["%", totalWeight] })] }), _jsx("div", { className: "space-y-4", children: Object.entries(criteriaWeights).map(([key, config]) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [_jsx("span", { children: config.icon }), config.name] }), _jsxs("span", { className: "font-mono font-medium text-foreground", children: [weights[key], "%"] })] }), _jsx(Slider, { value: [weights[key]], onValueChange: (value) => setWeights((prev) => ({ ...prev, [key]: value[0] })), max: 30, min: 0, step: 1, className: "cursor-pointer" })] }, key))) })] }), _jsxs(Card, { className: "p-4", children: [_jsxs("h3", { className: "font-semibold text-sm mb-3 flex items-center gap-2", children: [_jsx(PieChart, { className: "w-4 h-4 text-primary" }), "A\u011F\u0131rl\u0131k Da\u011F\u0131l\u0131m\u0131"] }), _jsx("div", { className: "h-48", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RadarChart, { data: weightDistributionData, children: [_jsx(PolarGrid, { stroke: "hsl(var(--border))" }), _jsx(PolarAngleAxis, { dataKey: "name", tick: { fontSize: 9, fill: "hsl(var(--muted-foreground))" } }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 30], tick: { fontSize: 8 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(Radar, { name: "A\u011F\u0131rl\u0131k", dataKey: "value", stroke: "hsl(var(--primary))", fill: "hsl(var(--primary))", fillOpacity: 0.3 })] }) }) })] })] }), _jsx("div", { className: "lg:col-span-9 space-y-4", children: !scenarioResults ? (_jsxs(Card, { className: "p-12 flex flex-col items-center justify-center text-center min-h-[400px]", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4", children: _jsx(BarChart3, { className: "w-8 h-8 text-primary" }) }), _jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: "Senaryo Analizi Ba\u015Flat\u0131n" }), _jsx("p", { className: "text-sm text-muted-foreground max-w-md mb-6", children: "Sol panelden kriter a\u011F\u0131rl\u0131klar\u0131n\u0131 ayarlay\u0131n ve \"\u00C7al\u0131\u015Ft\u0131r\" butonuna t\u0131klayarak senaryo sonu\u00E7lar\u0131n\u0131 g\u00F6r\u00FCnt\u00FCleyin." }), _jsxs(Button, { onClick: runScenario, className: "gap-2", children: [_jsx(PlayCircle, { className: "w-4 h-4" }), "Senaryoyu \u00C7al\u0131\u015Ft\u0131r"] })] })) : (_jsxs(_Fragment, { children: [_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs(Select, { value: selectedDistrict, onValueChange: setSelectedDistrict, children: [_jsx(SelectTrigger, { className: "w-[180px] h-9", children: _jsx(SelectValue, { placeholder: "B\u00F6lge Se\u00E7in" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "T\u00FCm B\u00F6lgeler" }), districts.map((d) => (_jsx(SelectItem, { value: d.name, children: d.name }, d.id)))] })] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Tabs, { value: viewMode, onValueChange: (v) => setViewMode(v), children: _jsxs(TabsList, { className: "h-9", children: [_jsxs(TabsTrigger, { value: "chart", className: "gap-1.5 text-xs px-3", children: [_jsx(BarChart3, { className: "w-3.5 h-3.5" }), "Grafik"] }), _jsxs(TabsTrigger, { value: "table", className: "gap-1.5 text-xs px-3", children: [_jsx(Table2, { className: "w-3.5 h-3.5" }), "Tablo"] })] }) }), _jsx(Button, { variant: "outline", size: "sm", className: "h-9", children: _jsx(Download, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", className: "h-9", children: _jsx(Maximize2, { className: "w-4 h-4" }) })] })] }), viewMode === "chart" ? (_jsx("div", { className: "h-[400px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: filteredResults, layout: "vertical", margin: { top: 5, right: 30, left: 80, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))", opacity: 0.5 }), _jsx(XAxis, { type: "number", domain: [0, 10], tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" }, axisLine: { stroke: "hsl(var(--border))" } }), _jsx(YAxis, { type: "category", dataKey: "name", tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" }, axisLine: { stroke: "hsl(var(--border))" }, width: 75 }), _jsx(Tooltip, { contentStyle: {
                                                                backgroundColor: "hsl(var(--card))",
                                                                border: "1px solid hsl(var(--border))",
                                                                borderRadius: "8px",
                                                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                            }, formatter: (value, name) => [
                                                                value.toFixed(2),
                                                                name === "scenario" ? "Senaryo" : "Orijinal",
                                                            ] }), _jsx(Legend, { wrapperStyle: { fontSize: 12 }, formatter: (value) => value === "original" ? "Orijinal" : "Senaryo" }), _jsx(Bar, { dataKey: "original", name: "original", fill: "hsl(var(--muted))", radius: [0, 4, 4, 0], barSize: 14 }), _jsx(Bar, { dataKey: "scenario", name: "scenario", radius: [0, 4, 4, 0], barSize: 14, children: filteredResults?.map((entry, index) => (_jsx(Cell, { fill: getBarColor(entry.change) }, `cell-${index}`))) })] }) }) })) : (_jsx("div", { className: "overflow-auto max-h-[400px]", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "sticky top-0 bg-card", children: _jsxs("tr", { className: "border-b border-border", children: [_jsx("th", { className: "text-left py-3 px-4 font-medium text-muted-foreground", children: "B\u00F6lge" }), _jsx("th", { className: "text-right py-3 px-4 font-medium text-muted-foreground", children: "Orijinal" }), _jsx("th", { className: "text-right py-3 px-4 font-medium text-muted-foreground", children: "Senaryo" }), _jsx("th", { className: "text-right py-3 px-4 font-medium text-muted-foreground", children: "De\u011Fi\u015Fim" }), _jsx("th", { className: "text-right py-3 px-4 font-medium text-muted-foreground", children: "%" })] }) }), _jsx("tbody", { children: filteredResults?.map((result, index) => (_jsxs("tr", { className: `border-b border-border/50 hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/20" : ""}`, children: [_jsx("td", { className: "py-3 px-4 font-medium", children: result.name }), _jsx("td", { className: "text-right py-3 px-4 font-mono", children: result.original.toFixed(2) }), _jsx("td", { className: "text-right py-3 px-4 font-mono font-medium", children: result.scenario.toFixed(2) }), _jsx("td", { className: `text-right py-3 px-4 font-mono ${getChangeColor(result.change)}`, children: _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(ChangeIcon, { change: result.change }), result.change > 0 ? "+" : "", result.change.toFixed(2)] }) }), _jsxs("td", { className: `text-right py-3 px-4 font-mono ${getChangeColor(result.change)}`, children: [result.changePercent > 0 ? "+" : "", result.changePercent.toFixed(1), "%"] })] }, result.name))) })] }) }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-sm mb-3", children: "De\u011Fi\u015Fim Da\u011F\u0131l\u0131m\u0131" }), _jsx("div", { className: "h-48", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RechartsPie, { children: [_jsx(Pie, { data: pieData, cx: "50%", cy: "50%", innerRadius: 40, outerRadius: 70, paddingAngle: 2, dataKey: "value", label: ({ name, value }) => `${name}: ${value}`, labelLine: false, children: pieData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }) })] }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-sm mb-3", children: "Orijinal vs Senaryo Kar\u015F\u0131la\u015Ft\u0131rmas\u0131" }), _jsx("div", { className: "h-48", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: filteredResults?.slice(0, 10), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))", opacity: 0.5 }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 9, fill: "hsl(var(--muted-foreground))" }, angle: -45, textAnchor: "end", height: 60 }), _jsx(YAxis, { domain: [0, 10], tick: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }), _jsx(Tooltip, { contentStyle: {
                                                                        backgroundColor: "hsl(var(--card))",
                                                                        border: "1px solid hsl(var(--border))",
                                                                        borderRadius: "8px",
                                                                    } }), _jsx(Area, { type: "monotone", dataKey: "original", stroke: "hsl(var(--muted-foreground))", fill: "hsl(var(--muted))", fillOpacity: 0.3, name: "Orijinal" }), _jsx(Area, { type: "monotone", dataKey: "scenario", stroke: "hsl(var(--primary))", fill: "hsl(var(--primary))", fillOpacity: 0.3, name: "Senaryo" })] }) }) })] })] })] })) })] })] }));
};
